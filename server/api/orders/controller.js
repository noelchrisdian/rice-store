import {
    createOrder,
    getOrder,
    getOrders
} from "../../services/orders.js"
import { StatusCodes } from "http-status-codes";
import { success } from "../../utils/response.js";

const index = async (req, res, next) => {
    try {
        const orders = await getOrders(req);
        success(res, orders, 'Orders fetched successfully');
    } catch (error) {
        next(error);
    }
}

const find = async (req, res, next) => {
    try {
        const order = await getOrder(req);
        success(res, order, 'Order fetched successfully');
    } catch (error) {
        next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const order = await createOrder(req);
        success(res, order, 'Order has been created', StatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

export {
    create,
    find,
    index
}