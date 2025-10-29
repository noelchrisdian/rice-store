import { getOrders, getUsers } from "../../services/admin.js"
import { success } from "../../utils/response.js";

const indexOrders = async (req, res, next) => {
    try {
        const result = await getOrders(req);
        success(res, result, 'Orders fetched successfully');
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

export {
    indexOrders,
    indexUsers
}