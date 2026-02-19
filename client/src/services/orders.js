import z from 'zod';
import { privateAPI } from "../utils/axios";

const orderDeliveredSchema = z.object({
    deliveredAt: z.coerce.date()
})

const orderShippedSchema = z.object({
    courier: z.string(),
    fee: z.coerce.number().min(0, `Biaya pengiriman tidak boleh bernilai negatif`),
    trackingNumber: z.string().min(5, 'Nomor resi minimal 5 karakter'),
    shippedAt: z.coerce.date()
})

const getCustomerOrder = async ({ limit, page, range, status }) => {
    const response = await privateAPI.get('/customers/orders', {
        params: { limit, page, range, status }
    })

    return response.data;
}

const getOrders = async ({ limit, page, range, search, status }) => {
    const response = await privateAPI.get('/admin/orders', {
        params: { limit, page, range, search, status }
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

const updateOrderDelivered = async (id, data) => {
    const response = await privateAPI.patch(`/admin/orders/${id}/delivered`, data);
    return response.data;
}

const updateOrderShipped = async (id, data) => {
    const response = await privateAPI.patch(`/admin/orders/${id}/shipped`, data);
    return response.data;
}

const updateOrderShippedInfo = async (id, data) => {
    const response = await privateAPI.patch(`/admin/orders/${id}/edit-shipping`, data);
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
    getOrders,
    orderDeliveredSchema,
    orderShippedSchema,
    updateOrderDelivered,
    updateOrderShipped,
    updateOrderShippedInfo
}