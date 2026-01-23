import {
    getIndexReviews,
    getProduct,
    getProducts,
    getReviews
} from "../../services/global.js";
import { success } from '../../utils/response.js';

const indexProducts = async (req, res, next) => {
    try {
        const products = await getProducts();
        success(res, products, 'Products fetched successfully');
    } catch (error) {
        next(error);
    }
}

const findProduct = async (req, res, next) => {
    try {
        const product = await getProduct(req);
        success(res, product, `${product.name} fetched successfully`);
    } catch (error) {
        next(error);
    }
}

const indexReviews = async (req, res, next) => {
    try {
        const reviews = await getIndexReviews();
        success(res, reviews, 'Reviews fetched successfully');
    } catch (error) {
        next(error);
    }
}

const productReviews = async (req, res, next) => {
    try {
        const reviews = await getReviews(req);
        success(res, reviews, 'Reviews fetched successfully');
    } catch (error) {
        next(error);
    }
}

export {
    findProduct,
    indexProducts,
    indexReviews,
    productReviews
}