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
            .populate('products.product', 'name price')
            .populate('user', 'name phoneNumber email address'),
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
    const product = await Products.findOne({ _id: id });
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Reviews.find({ product: id })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('user', 'name avatar')
            .populate('product', 'name'),
        Reviews.countDocuments({ product: id })
    ])

    const totalPages = Math.ceil(total / limit);
    return {
        reviews,
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
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
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