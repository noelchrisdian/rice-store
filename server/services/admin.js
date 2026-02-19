import dayjs from 'dayjs';
import mongoose from 'mongoose';
import { BadRequest } from '../errors/badRequest.js';
import {
    escape,
    orderDeliveredSchema,
    orderShippedSchema
} from '../utils/zod.js';
import { NotFound } from '../errors/notFound.js';
import { orderModel as Orders } from '../api/orders/model.js';
import { ParseError } from '../errors/parseError.js';
import { productModel as Products } from '../api/products/model.js';
import { reviewModel as Reviews } from '../api/reviews/model.js';
import { StatusCodes } from 'http-status-codes';
import { userModel as Users } from '../api/users/model.js';
import { v2 as cloudinary } from 'cloudinary';

const getOrders = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    const { range, search, status } = req.query;

    if (status) {
        switch (status) {
            case 'pending':
                filter['payment.status'] = 'pending';
                break;
            case 'failed':
                filter['payment.status'] = { $in: ['deny', 'cancel', 'failure', 'expire'] };
                break;
            case 'processing':
            case 'shipped':
            case 'delivered':
                filter['payment.status'] = { $in: ['settlement', 'capture'] };
                filter['shipping.status'] = status;
                break;
        }
    }
    
    if (range && range !== '') {
        let startDate;
        const endDate = dayjs().endOf('day').toDate();

        switch (range) {
            case 'today':
                startDate = dayjs().startOf('day').toDate()
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

    const pipeline = [
        { $match: filter },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        ...(search ? [{ $match: { 'user.name': { $regex: escape(search.trim()), $options: 'i' } } }] : [])
    ]

    const [orders, totalAggregate] = await Promise.all([
        Orders.aggregate([
            ...pipeline,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]),
        Orders.aggregate([
            ...pipeline,
            { $count: 'total' }
        ])
    ])

    const total = totalAggregate[0]?.total || 0;

    return {
        orders,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }
}

const getOrder = async (req) => {
    const { id } = req.params;
    const order = await Orders.findById(id)
        .populate('products.product', 'name image price')
        .populate('user', 'name phoneNumber email address')
        .lean()

    if (!order) {
        throw new NotFound(`Order doesn't exist`);
    }

    return order;
}

const updateOrderShipped = async (req) => {
    if (!req.file) throw new BadRequest('Image is required');

    const imageURL = req.file?.path;
    const imagePublicID = req.file?.filename;

    const { id } = req.params;
    const order = await Orders.findById(id);
    if (!order) throw new NotFound(`Order doesn't exist`);

    if (order.shipping.status === null || order.shipping.status !== 'processing') {
        throw new BadRequest(`Only orders with status processing can be marked as shipped`);
    }

    const parse = await orderShippedSchema.safeParseAsync(req.body);
    if (!parse.success) {
        if (imagePublicID) await cloudinary.uploader.destroy(imagePublicID);

        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError(`Invalid data type`, StatusCodes.BAD_REQUEST, errors);
    }

    return await Orders.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                "shipping.status": 'shipped',
                "shipping.courier": parse.data.courier,
                "shipping.fee": parse.data.fee,
                "shipping.trackingNumber": parse.data.trackingNumber,
                "shipping.shippedAt": parse.data.shippedAt,
                "shipping.proofImage": {
                    imageURL,
                    imagePublicID
                }
            }
        },
        { new: true }
    )
}

const updateOrderShippedInfo = async (req) => {
    const { id } = req.params;
    const order = await Orders.findById(id);
    if (!order) throw new NotFound(`Order doesn't exist`);

    if (order.shipping.status !== 'shipped') {
        throw new BadRequest('Shipping info can only be edited for shipped orders');
    }

    const parse = await orderShippedSchema.safeParseAsync(req.body);
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError(`Invalid data type`, StatusCodes.BAD_REQUEST, errors);
    }

    return await Orders.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                "shipping.courier": parse.data.courier,
                "shipping.fee": parse.data.fee,
                "shipping.trackingNumber": parse.data.trackingNumber,
                "shipping.shippedAt": parse.data.shippedAt
            }
        },
        { new: true }
    )
}

const updateOrderDelivered = async (req) => {
    if (!req.file) throw new BadRequest('Image is required');

    const imageURL = req.file?.path;
    const imagePublicID = req.file?.filename;

    const { id } = req.params;
    const order = await Orders.findById(id);
    if (!order) throw new NotFound(`Order doesn't exist`);

    if (order.shipping.status === null || order.shipping.status !== 'shipped') {
        throw new BadRequest(`Only orders with status shipped can be marked as delivered`);
    }

    const parse = await orderDeliveredSchema.safeParseAsync(req.body);
    if (!parse.success) {
        if (imagePublicID) await cloudinary.uploader.destroy(imagePublicID);

        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }

    const oldPublicID = order.shipping.proofImage.imagePublicID;
    const updated = await Orders.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                "shipping.status": 'delivered',
                "shipping.deliveredAt": parse.data.deliveredAt,
                "shipping.proofImage": {
                    imageURL,
                    imagePublicID
                }
            }
        },
        { new: true }
    )
    if (updated && oldPublicID) await cloudinary.uploader.destroy(oldPublicID);

    return updated;
}

const deleteReview = async (req) => {
    const { reviewID } = req.params;
    const review = await Reviews.findOneAndDelete({ _id: reviewID })
        .populate('product', 'name')
        .populate('user', 'name')

    if (!review) {
        throw new NotFound(`Review doesn't exist`);
    }

    return review;
}

const getReviews = async (req) => {
    const { id } = req.params;
    const product = await Products.findById(id);
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total, statistic] = await Promise.all([
        Reviews.find({ product: id })
            .select('user rating comment createdAt')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('user', 'name avatar')
            .lean(),
        Reviews.countDocuments({ product: id }),
        Reviews.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    average: { $avg: '$rating' },
                    total: { $sum: 1 },
                    star5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                    star4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                    star3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                    star2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                    star1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
                }
            }
        ])
    ])

    const analytics = statistic.length > 0 ? {
        average: statistic[0].average.toFixed(1),
        total: statistic[0].total,
        star5: statistic[0].star5,
        star4: statistic[0].star4,
        star3: statistic[0].star3,
        star2: statistic[0].star2,
        star1: statistic[0].star1
    } : {
        average: 0,
        total: 0,
        star5: 0,
        star4: 0,
        star3: 0,
        star2: 0,
        star1: 0
    }

    const totalPages = Math.ceil(total / limit);
    return {
        reviews,
        analytics,
        meta: {
            total,
            page,
            limit,
            totalPages
        }
    }
}

const getUsers = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    const filter = {};
    filter.role = 'customer';

    if (search) {
        filter.$or = [
            { name: { $regex: escape(search), $options: 'i' } },
            { email: { $regex: escape(search), $options: 'i' } },
            { phoneNumber: { $regex: escape(search), $options: 'i' } }
        ]
    }

    const [users, total] = await Promise.all([
        Users.find(filter)
            .select('name phoneNumber email address createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Users.countDocuments(filter)
    ])

    const totalPages = Math.ceil(total / limit);
    return {
        users,
        meta: {
            total,
            page,
            limit,
            totalPages
        }
    }
}

const getUser = async (req) => {
    const user = await Users.findById(req.user.id).lean();

    if (!user) {
        throw new NotFound(`User doesn't exist`);
    }

    return user;
}

export {
    deleteReview,
    getOrder,
    getOrders,
    getReviews,
    getUser,
    getUsers,
    updateOrderDelivered,
    updateOrderShipped,
    updateOrderShippedInfo
}