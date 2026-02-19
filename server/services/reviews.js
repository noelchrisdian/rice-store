import mongoose from "mongoose";
import { BadRequest } from "../errors/badRequest.js";
import { Forbidden } from '../errors/forbidden.js';
import { NotFound } from '../errors/notFound.js';
import { orderModel as Orders } from "../api/orders/model.js";
import { ParseError } from '../errors/parseError.js';
import { reviewModel as Reviews } from "../api/reviews/model.js";
import { reviewSchema } from "../utils/zod.js";
import { StatusCodes } from 'http-status-codes';

const createReview = async (req) => {
    const { orderID, productID } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const parse = await reviewSchema.safeParseAsync(req.body);
        if (!parse.success) {
            const errors = parse.error.issues.map((error) => error.message);
            throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors)
        }

        const order = await Orders.findOne({ _id: orderID, user: req.user.id }).session(session);
        if (!order) {
            throw new NotFound(`Order doesn't exist`);
        }
        if (order.shipping.status !== 'delivered') {
            throw new Forbidden(`Order is not completed yet`);
        }

        const item = order.products.find((p) => p.product.toString() === productID.toString())
        if (!item) {
            throw new BadRequest(`Product doesn't exist in this order`);
        }
        if (item.reviewed) {
            throw new BadRequest(`Product already reviewed`);
        }

        const existing = await Reviews.findOne({ product: productID, order: orderID, user: req.user.id }).session(session);
        if (existing) {
            throw new BadRequest('Review exist');
        }

        const [review] = await Reviews.create([{
            user: req.user.id,
            product: productID,
            order: orderID,
            rating: parse.data.rating,
            comment: parse.data.comment
        }], { session })

        const updatedOrder = await Orders.findOneAndUpdate(
            { _id: orderID, 'products.product': new mongoose.Types.ObjectId(productID) },
            { $set: { 'products.$.reviewed': true } },
            { new: true, session }
        )
        if (!updatedOrder) {
            throw new BadRequest('Failed to update order reviewed status');
        }
        await session.commitTransaction();
        
        return review;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export {
    createReview
}