import { privateAPI } from "../utils/axios";

const getReviews = async (id, { limit, page }) => {
    const response = await privateAPI.get(`/admin/products/${id}/reviews`, {
        params: { limit, page }
    })
    return response.data;
}

export {
    getReviews
}