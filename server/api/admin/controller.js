import {
    deleteReview,
    getOrder,
    getOrders,
    getReviews,
    getUser,
    getUsers
} from "../../services/admin.js"
import { success } from "../../utils/response.js";

const indexOrders = async (req, res, next) => {
    try {
        const result = await getOrders(req);
        success(res, result, 'Orders fetched successfully');
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
    indexUsers,
    removeReview
}