import z from "zod";
import { privateAPI } from "../utils/axios";

const inventorySchema = z.object({
    quantity: z.coerce.number().positive('Angka tidak valid'),
    receivedAt: z.coerce.date('Tanggal tidak valid')
})

const getInventories = async (id, { limit, page }) => {
    const response = await privateAPI.get(`/admin/products/${id}/inventories`, {
        params: { limit, page }
    })
    return response.data;
}

const getInventory = async (id, productID) => {
    const response = await privateAPI.get(`/admin/products/${productID}/inventories/${id}`);
    return response.data;
}

const addInventory = async (data, productID) => {
    const response = await privateAPI.post(`/admin/products/${productID}/inventories`, data);
    return response.data;
}

const updateInventory = async (data, id, productID) => {
    const response = await privateAPI.put(`/admin/products/${productID}/inventories/${id}`, data);
    return response.data;
}

export {
    addInventory,
    getInventory,
    getInventories,
    inventorySchema,
    updateInventory
}