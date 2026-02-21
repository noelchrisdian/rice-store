import dayjs from 'dayjs';
import { orderModel as Orders } from '../api/orders/model.js';
import { productModel as Products } from '../api/products/model.js';
import { userModel as Users } from '../api/users/model.js';

const getTodayOrders = async () => {
    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();
    const orders = await Orders.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
                _id: null,
                income: { $sum: "$totalPrice" },
                totalOrders: { $sum: 1 }
            }
        }
    ])

    return {
        income: orders[0]?.income || 0,
        orders: orders[0]?.totalOrders || 0
    }
}

const getRecentOrders = async () => {
    return await Orders.find()
        .sort({ createdAt: -1 })
        .select('user products totalPrice payment.status shipping.status')
        .populate({ path: 'user', select: 'name' })
        .limit(5)
        .lean()
}

const getRecentProducts = async () => {
    return await Products
        .find()
        .sort({ createdAt: -1 })
        .populate('inventories', 'remaining')
        .limit(3)
}

const getRecentUsers = async () => {
    return await Users.find({ role: 'customer' })
        .sort({ createdAt: -1 })
        .select('name phoneNumber avatar')
        .limit(5)
        .lean()
}

const getUserStats = async () => {
    const start = dayjs().startOf('month').toDate();

    const [total, newThisMonth] = await Promise.all([
        Users.countDocuments({ role: 'customer' }),
        Users.countDocuments({ role: 'customer', createdAt: { $gte: start } })
    ])

    return {
        newThisMonth,
        total
    }
}

export {
    getRecentProducts,
    getRecentOrders,
    getRecentUsers,
    getTodayOrders,
    getUserStats
}