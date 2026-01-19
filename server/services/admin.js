import mongoose from 'mongoose';
import { NotFound } from '../errors/notFound.js';
import { orderModel as Orders } from '../api/orders/model.js';
import { productModel as Products } from '../api/products/model.js';
import { reviewModel as Reviews } from '../api/reviews/model.js';
import { userModel as Users } from '../api/users/model.js';

const getOrders = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        Orders.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name')
            .lean(),
        Orders.countDocuments()
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
    const order = await Orders.findById(id)
        .populate('products.product', 'name image price')
        .populate('user', 'name phoneNumber email address')
        .lean()

    if (!order) {
        throw new NotFound(`Order doesn't exist`);
    }

    return order;
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

    const [users, total] = await Promise.all([
        Users.find({ role: 'customer' })
            .select('name phoneNumber email address createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Users.countDocuments({ role: 'customer' })
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
    getUsers
}