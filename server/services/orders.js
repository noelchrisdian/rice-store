import midtransClient from 'midtrans-client';
import mongoose from "mongoose";
import { BadRequest } from "../errors/badRequest.js";
import { cartModel as Carts } from "../api/carts/model.js";
import { inventoryModel as Inventories } from '../api/inventories/model.js';
import { NotFound } from "../errors/notFound.js";
import { orderModel as Orders } from "../api/orders/model.js";
import { userModel as Users } from '../api/users/model.js';

const getOrders = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        Orders.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('products.product', 'name price')
            .populate('user', 'name phoneNumber email address'),
        Orders.countDocuments({ user: req.user.id })
    ])

    const totalPages = Math.ceil(total / limit);
    return {
        orders,
        meta: {
            total,
            page,
            limit,
            totalPages
        }
    }
}

const getOrder = async (req) => {
    const { id } = req.params;
    const order = await Orders.findOne({ _id: id })
        .populate('products.product', 'name price')
        .populate('user', 'name phoneNumber email address')

    if (!order) {
        throw new NotFound(`Order doesn't exist`);
    }

    return order;
}

const createOrder = async (req) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cart = await Carts.findOne({ user: req.user.id })
            .populate('products.product')
            .session(session)
        if (!cart) {
            throw new NotFound('Cart not found');
        } 
        if (cart.products.length === 0) {
            throw new BadRequest('Cart is empty');
        }

        for (const product of cart.products) {
            const inventories = await Inventories.find({ product: product.product._id })
                .sort({ receivedAt: 1 })
                .session(session)
            const stockAvailable = inventories.reduce((acc, inventory) => acc + inventory.remaining, 0);
            const requiredKg = product.quantity * product.product.weightPerUnit;

            if (requiredKg > stockAvailable) {
                throw new BadRequest(`Stok kurang untuk ${product.product.name}`);
            }
        }

        const [order] = await Orders.create([{
            user: req.user.id,
            products: cart.products.map((item) => {
                return {
                    product: item.product._id,
                    quantity: item.quantity
                }
            }),
            totalPrice: cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
            status: 'pending'
        }], { session })

        const user = await Users.findById(req.user.id).session(session);
        if (!user) {
            throw new NotFound(`User not found`);
        }

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY
        })

        const parameter = {
            transaction_details: {
                "order_id": String(order._id),
                "gross_amount": order.totalPrice
            },
            credit_card: {
                "secure": true
            },
            customer_details: {
                first_name: user.name,
                email: user.email,
                phone: user.phoneNumber
            },
            callbacks: {
                finish: `${process.env.PAYMENT_REDIRECT_URL}?order_id=${String(order._id)}`
            }
        }

        const transaction = await snap.createTransaction(parameter);
        await session.commitTransaction();
        cart.products = [];
        cart.markModified('products');
        await cart.save();

        return {
            orderID: order._id,
            snap: transaction
        }
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const midtransWebhook = async (req) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const client = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY
        })

        const statusResponse = await client.transaction.notification(req.body);
        const orderID = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        const order = await Orders.findOne({ _id: new mongoose.Types.ObjectId(orderID) })
            .populate('products.product')
            .session(session)

        if (transactionStatus === 'settlement' || (transactionStatus === 'capture' && fraudStatus === 'accept')) {
            for (const product of order.products) {
                let requiredKg = product.quantity * product.product.weightPerUnit;
                const inventories = await Inventories.find({ product: product.product._id })
                    .sort({ receivedAt: 1 })
                    .session(session)

                for (const inventory of inventories) {
                    if (requiredKg <= 0) break;
                    if (inventory.remaining >= requiredKg) {
                        inventory.remaining -= requiredKg;
                        await inventory.save({ session });
                        requiredKg = 0;
                    } else {
                        requiredKg -= inventory.remaining;
                        inventory.remaining = 0;
                        await inventory.save({ session });
                    }
                }
                if (requiredKg > 0) {
                    order.status = 'failed';
                    order.payment.status = 'failure';
                    order.payment.paidAt = new Date();
                    await order.save({ session });
                    await session.commitTransaction();
                    
                    return order;
                }

                const remaining = inventories.reduce((acc, inventory) => acc + inventory.remaining, 0)

                product.product.stock = remaining || 0;
                await product.product.save({ session });
            }

            order.status = 'success';
            order.payment.status = transactionStatus;
            order.payment.paidAt = new Date();
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            order.status = 'failed';
            order.payment.status = transactionStatus;
        }
        await order.save({ session });
        await session.commitTransaction();

        return order;
    } catch (error) {
        await session.abortTransaction();
        console.error(`Webhook error : ${error}`);
        
        return;
    } finally {
        session.endSession();
    }
}

export {
    createOrder,
    getOrder,
    getOrders,
    midtransWebhook
}