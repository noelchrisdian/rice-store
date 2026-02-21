import {
    deleteReview,
    getOrder,
    getOrders,
    getReviews,
    getUser,
    getUsers,
    updateOrderDelivered,
    updateOrderShipped,
    updateOrderShippedInfo
} from "../../services/admin.js";
import {
    getRecentOrders,
    getRecentProducts,
    getRecentUsers,
    getTodayOrders,
    getUserStats
} from "../../services/dashboard.js";
import { success } from "../../utils/response.js";

const indexOrders = async (req, res, next) => {
    try {
        const result = await getOrders(req);
        success(res, result, 'Orders fetched successfully');
    } catch (error) {
        next(error);
    }
}

const indexRecentOrders = async (req, res, next) => {
    try {
        const orders = await getRecentOrders();
        success(res, orders, 'Orders fetched successfully');
    } catch (error) {
        next(error);
    }
}

const indexRecentProducts = async (req, res, next) => {
    try {
        const products = await getRecentProducts();
        success(res, products, 'Products fetched successfully');
    } catch (error) {
        next(error);
    }
}

const indexRecentUsers = async (req, res, next) => {
    try {
        const users = await getRecentUsers();
        success(res, users, 'Users fetched successfully');
    } catch (error) {
        next(error);
    }
}

const userStats = async (req, res, next) => {
    try {
        const user = await getUserStats();
        success(res, user, 'User fetched successfully');
    } catch (error) {
        next(error);
    }
}

const indexTodayOrders = async(req, res, next) => {
    try {
        const orders = await getTodayOrders();
        success(res, orders, 'Orders fetched successfully');
    } catch (error) {
        next(error);
    }
}

const findOrder = async (req, res, next) => {
    try {
        const order = await getOrder(req);
        success(res, order, 'Order fetched successfully')
    } catch (error) {
        next(error);
    }
}

const updateShipped = async (req, res, next) => {
    try {
        const order = await updateOrderShipped(req);
        success(res, order, 'Order updated successfully');
    } catch (error) {
        next(error);
    }
}

const updateShippedInfo = async (req, res, next) => {
    try {
        const order = await updateOrderShippedInfo(req);
        success(res, order, 'Order updated successfully');
    } catch (error) {
        next(error);
    }
}

const updateDelivered = async (req, res, next) => {
    try {
        const order = await updateOrderDelivered(req);
        success(res, order, 'Order updated successfully');
    } catch (error) {
        next(error);
    }
}

const indexReviews = async (req, res, next) => {
    try {
        const result = await getReviews(req);
        success(res, result, 'Reviews fetched successfully');
    } catch (error) {
        next(error);
    }
}

const removeReview = async (req, res, next) => {
    try {
        const review = await deleteReview(req);
        success(res, review, `Review by ${review.user.name} on ${review.product.name} has been deleted`);
    } catch (error) {
        next(error);
    }
}

const indexUsers = async (req, res, next) => {
    try {
        const result = await getUsers(req);
        success(res, result, 'Users fetched successfully');
    } catch (error) {
        next(error);
    }
}

const findUser = async (req, res, next) => {
    try {
        const user = await getUser(req);
        success(res, user, 'User fetched successfully');
    } catch (error) {
        next(error);
    }
}

export {
    findOrder,
    findUser,
    indexOrders,
    indexReviews,
    indexRecentOrders,
    indexRecentProducts,
    indexRecentUsers,
    indexTodayOrders,
    indexUsers,
    removeReview,
    updateDelivered,
    updateShipped,
    updateShippedInfo,
    userStats
}