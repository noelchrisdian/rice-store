import { orderModel as Orders } from '../api/orders/model.js';
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
            .populate('products.product', 'name price'),
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

export {
    getOrders,
    getUsers
}