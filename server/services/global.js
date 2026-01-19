import { NotFound } from "../errors/notFound.js";
import { productModel as Products } from "../api/products/model.js";
import { reviewModel as Reviews } from '../api/reviews/model.js';

const getProducts = async () => {
    return await Products.find()
        .select('name price image description inventories weightPerUnit')
        .populate('inventories', 'remaining')
        .sort({ name: 1 })
}

const getProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findById(id).select('name price image description').lean();
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    return product;
}

const getReviews = async (req) => {
    const { id } = req.params;
    const product = await Products.findById(id).lean();
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