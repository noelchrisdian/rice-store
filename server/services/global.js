import { NotFound } from "../errors/notFound.js";
import { productModel as Products } from "../api/products/model.js";
import { reviewModel as Reviews } from '../api/reviews/model.js';

const getProducts = async () => {
    return await Products.find({ stock: { $gt: 0 } })
        .select('name price image description stock')
        .sort({ name: 1 })
}

const getProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findOne({ _id: id }).select('name price image description stock');
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    return product;
}

const getReviews = async (req) => {
    const { id } = req.params;
    const product = await Products.findOne({ _id: id });
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    return await Reviews.find({ product: id })
        .populate('user', 'name')
        .limit(5)
        .sort({ createdAt: -1 })
}

export {
    getProduct,
    getProducts,
    getReviews
}