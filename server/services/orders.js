import mongoose from "mongoose";
import { BadRequest } from "../errors/badRequest.js";
import { cartModel as Carts } from "../api/carts/model.js";
import { NotFound } from "../errors/notFound.js";
import { orderModel as Orders } from "../api/orders/model.js";

const getOrders = async (req) => {
    return await Orders.find({ user: req.user.id }).populate('products.product');
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

export {
    createOrder,
    getOrders
}