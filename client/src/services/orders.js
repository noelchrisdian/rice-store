import { privateAPI } from "../utils/axios";

const getCustomerOrder = async ({ limit, page, range, status }) => {
    const response = await privateAPI.get('/customers/orders', {
        params: {
            limit,
            page,
            range,
            status
        }
    })

    return response.data;
}

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

const createInvoice = async (id) => {
    const response = await privateAPI.get(`/customers/orders/${id}/invoice`, {
        responseType: 'blob'
    })
    return response.data;
}

const createAdminInvoice = async (id) => {
    const response = await privateAPI.get(`/admin/orders/${id}/invoice`, {
        responseType: 'blob'
    })
    return response.data;
}

const createOrder = async () => {
    const response = await privateAPI.post('/customers/orders');
    return response.data;
}

const cancelOrder = async (id) => {
    const response = await privateAPI.post(`/customers/orders/${id}/cancel-order`);
    return response.data;
}

const findOrder = async (id) => {
    const response = await privateAPI.get(`/customers/orders/${id}`);
    return response.data;
}

export {
    cancelOrder,
    createAdminInvoice,
    createInvoice,
    createOrder,
    findOrder,
    getCustomerOrder,
    getOrder,
    getOrders
}