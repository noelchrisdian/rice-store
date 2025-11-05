import crypto from 'crypto';
import mongoose from "mongoose";
import { BadRequest } from "../errors/badRequest.js";
import { cartModel as Carts } from "../api/carts/model.js";
import { inventoryModel as Inventories } from '../api/inventories/model.js';
import { NotFound } from "../errors/notFound.js";
import { orderModel as Orders } from "../api/orders/model.js";

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

        const response = await fetch(process.env.MIDTRANS_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`
            },
            body: JSON.stringify({
                transaction_details: {
                    "order_id": String(order._id),
                    "gross_amount": order.totalPrice
                },
                credit_card: {
                    "secure": true
                },
                customer_details: {
                    email: req.user.email
                },
                callbacks: {
                    finish: process.env.PAYMENT_REDIRECT_URL
                }
            })
        })

        const data = await response.json();
        if (!response.ok) {
            throw new BadRequest(data.status_message || 'Something wrong with Midtrans');
        }
        await session.commitTransaction();
        cart.products = [];
        cart.markModified('products');
        await cart.save();

        return {
            orderID: order._id,
            snap: data
        }
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

const midtransWebhook = async (req) => {
    const {
        order_id,
        transaction_status,
        fraud_status,
        signature_key,
        status_code,
        gross_amount
    } = req.body;

    const signature = crypto.createHash('sha512')
        .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
        .digest('hex')
    if (signature_key !== signature) {
        throw new BadRequest('Invalid Midtrans signature');
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order = await Orders.findOne({ _id: new mongoose.Types.ObjectId(order_id) }).populate('products.product', 'name price').session(session);
        if (!order) {
            throw new NotFound(`Order doesn't exist`);
        }

        if (['cancel', 'deny', 'expire', 'failure', 'refund', 'partial_refund'].includes(transaction_status)) {
            order.status = 'failed';
            order.payment.status = transaction_status;
        }

        if (transaction_status === 'settlement' || (transaction_status === 'capture' && fraud_status === 'accept')) {
            for (const product of order.products) {
                const inventories = await Inventories.find({ product: product._id })
                    .sort({ receivedAt: 1 })
                    .session(session)
                if (!inventories.length) {
                    throw new NotFound(`There are no inventories for this product`);
                }

                for (const inventory of inventories) {
                    if (product.quantity <= 0) break;
                    if (inventory.remaining >= product.quantity) {
                        inventory.remaining -= product.quantity;
                        await inventory.save({ session });
                        product.quantity = 0;
                    } else {
                        product.quantity -= inventory.remaining;
                        inventory.remaining = 0;
                        await inventory.save({ session });
                    }
                }

                if (product.quantity > 0) {
                    throw new BadRequest(`Insufficient stock for product ${product.name}`);
                }
            }

            order.status = 'success';
            order.payment.status = transaction_status;
            order.payment.paidAt = new Date();
            await order.save({ session });
        }
        await session.commitTransaction();

        return order;
    } catch (error) {
        await session.abortTransaction();
        throw error;
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