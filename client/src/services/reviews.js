import z from 'zod';
import { api, privateAPI } from "../utils/axios";

const reviewSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(5, 'Ulasan minimal 5 karakter')
}) 

const getReviews = async (id, { limit, page }) => {
    const response = await privateAPI.get(`/admin/products/${id}/reviews`, {
        params: { limit, page }
    })
    return response.data;
}

const getIndexReviews = async () => {
    const response = await api.get('/reviews');
    return response.data;
}

const getProductReview = async (id) => {
    const response = await api.get(`/products/${id}/reviews`);
    return response.data;
}

const createReview = async (data, orderID, productID) => {
    const response = await privateAPI.post(`/customers/orders/${orderID}/products/${productID}/review`, data);
    return response.data;
}

export {
    createReview,
    getIndexReviews,
    getProductReview,
    getReviews,
    reviewSchema
}