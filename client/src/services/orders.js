import { privateAPI } from "../utils/axios";

const getOrders = async ({ limit, page }) => {
    const response = await privateAPI.get('/admin/orders', {
        params: { limit, page }
    })
    return response.data;
}

const getOrder = async (id) => {
    const response = await privateAPI.get(`/admin/orders/${id}`);
    return response.data;
}

export {
    getOrder,
    getOrders
}