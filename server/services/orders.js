import dayjs from 'dayjs';
import midtransClient from 'midtrans-client';
import mongoose from "mongoose";
import { BadRequest } from "../errors/badRequest.js";
import { cartModel as Carts } from "../api/carts/model.js";
import { Forbidden } from '../errors/forbidden.js';
import { inventoryModel as Inventories } from '../api/inventories/model.js';
import { NotFound } from "../errors/notFound.js";
import { orderModel as Orders } from "../api/orders/model.js";
import { userModel as Users } from '../api/users/model.js';

const getOrders = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    const { range, status } = req.query;

    if (status) {
        filter.status = status;
    }

    if (range && range !== '') {
        let startDate;
        const endDate = dayjs().endOf('day').toDate();

        switch (range) {
            case 'today':
                startDate = dayjs().startOf('day').toDate();
                break;
            case '7d':
                startDate = dayjs().subtract(7, 'day').startOf('day').toDate();
                break;
            case '30d':
                startDate = dayjs().subtract(30, 'day').startOf('day').toDate();
                break;
            case '90d':
                startDate = dayjs().subtract(90, 'day').startOf('day').toDate();
                break;
            default:
                startDate = null;
                break;
        }

        filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    const [orders, total] = await Promise.all([
        Orders.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('products.product', 'name price image')
            .lean(),
        Orders.countDocuments(filter)
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
        .populate('products.product', 'name image price')
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
            .populate({
                path: 'products.product',
                populate: {
                    path: 'inventories',
                    select: 'remaining'
                }
            })
            .session(session);

        if (!cart || cart.products.length === 0) {
            throw new BadRequest('Cart not found or empty');
        }

        const reservedStock = [];

        for (const product of cart.products) {
            const inventories = await Inventories
                .find({
                    product: product.product._id,
                    remaining: { $gt: 0 },
                    status: 'available'
                })
                .sort({ receivedAt: 1 })
                .session(session)

            let requiredKg = product.quantity * product.product.weightPerUnit;

            if (requiredKg > (product.product.stock * product.product.weightPerUnit)) {
                throw new BadRequest(`Stok tidak mencukupi untuk ${product.product.name}`);
            }

            for (const inventory of inventories) {
                if (requiredKg <= 0) break;

                const take = Math.min(inventory.remaining, requiredKg);
                if (take <= 0) continue;

                const updated = await Inventories.findOneAndUpdate(
                    { _id: inventory._id, remaining: { $gte: take } },
                    {
                        $inc: { remaining: -take },
                        $set: { status: (inventory.remaining - take) <= 0 ? 'depleted' : 'available' }
                    },
                    { session, new: true }
                )

                if (!updated) {
                    throw new BadRequest(`Stok tidak mencukupi untuk ${product.product.name}`);
                }

                requiredKg -= take;
                reservedStock.push({
                    inventory: inventory._id,
                    quantity: take
                })
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
            reservedStock,
            totalPrice: cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
            status: 'pending',
            payment: {
                method: 'midtrans',
                status: 'pending'
            }
        }], { session });

        await Carts.updateOne(
            { _id: cart._id },
            { $set: { products: [] } },
            { session }
        )

        await session.commitTransaction();

        const user = await Users.findById(req.user.id);
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
            customer_details: {
                first_name: user.name,
                email: user.email,
                phone: user.phoneNumber
            }
        }

        const transaction = await snap.createTransaction(parameter);
        await Orders.updateOne(
            { _id: order._id },
            {
                $set: {
                    "payment.midtransOrderID": String(order._id),
                    "payment.midtransTransactionID": transaction?.token
                }
            }
        )

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

const cancelOrder = async (req) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const order = await Orders.findById(id).session(session);
        if (!order) throw new NotFound('Order not found');
        if (order.status !== 'pending') throw new BadRequest(`Order can't be cancelled`);
        if (!order.user._id.equals(req.user.id)) throw new Forbidden('User not authorized');

        for (const item of order.reservedStock) {
            const inventory = await Inventories.findById(item.inventory).session(session);
            inventory.remaining += item.quantity;
            await inventory.save({ session });
        }

        order.reservedStock = [];
        order.status = 'failed';
        order.payment.status = 'cancel';
        await order.save({ session });

        await session.commitTransaction();
        return order;
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
        const { order_id, transaction_id, transaction_status, fraud_status } = statusResponse;

        const order = await Orders.findOne({ _id: order_id })
            .populate('products.product')
            .session(session)

        if (!order) {
            throw new NotFound('Order not found');
        }

        if (transaction_status === 'settlement' || (transaction_status === 'capture' && fraud_status === 'accept')) {
            order.status = 'success';
            order.payment.status = transaction_status;
            order.payment.paidAt = new Date();
        } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
            for (const item of order.reservedStock) {
                const inventory = await Inventories.findById(item.inventory).session(session);
                inventory.remaining += item.quantity;
                await inventory.save({ session });
            }

            order.reservedStock = [];
            order.status = 'failed';
            order.payment.status = transaction_status;
            order.payment.midtransTransactionID = transaction_id;
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
    cancelOrder,
    createOrder,
    getOrder,
    getOrders,
    midtransWebhook
}