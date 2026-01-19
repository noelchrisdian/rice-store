import z from 'zod';
import { api, privateAPI } from "../utils/axios";

const productSchema = z.object({
    name: z.string().min(5, 'Nama produk minimal 5 karakter'),
    price: z.coerce.number().positive('Angka tidak valid'),
    description: z.string().optional(),
    unit: z.string().default('package').optional(),
    weightPerUnit: z.coerce.number().int().positive('Angka tidak valid')
})

const getProducts = async () => {
    const response = await privateAPI.get('/admin/products');
    return response.data;
}

const getGlobalProducts = async () => {
    const response = await api.get('/products');
    return response.data;
}

const getProduct = async (id) => {
    const response = await privateAPI.get(`/admin/products/${id}`);
    return response.data;
}

const getGlobalProduct = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
}

const addProduct = async (data) => {
    const response = await privateAPI.post('/admin/products', data);
    return response.data;
}

const updateProduct = async (data, id) => {
    const response = await privateAPI.put(`/admin/products/${id}`, data);
    return response.data;
}

const deleteProduct = async (id) => {
    const response = await privateAPI.delete(`/admin/products/${id}`);
    return response.data;
}

export {
    addProduct,
    deleteProduct,
    getGlobalProduct,
    getProduct,
    getGlobalProducts,
    getProducts,
    productSchema,
    updateProduct
}