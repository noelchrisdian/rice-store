import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from "../../services/products.js"
import { success } from "../../utils/response.js";

const index = async (req, res, next) => {
    try {
        const products = await getProducts();
        success(res, products, 'Products fetched successfully');
    } catch (error) {
        next(error);
    }
}

const find = async (req, res, next) => {
    try {
        const product = await getProduct(req);
        success(res, product, `${product.name} fetched successfully`);
    } catch (error) {
        next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const { product, inventory } = await createProduct(req);
        success(res, { product, inventory }, `${product.name} has been created`);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const product = await updateProduct(req);
        success(res, product, `${product.name} has been updated`);
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const product = await deleteProduct(req);
        success(res, product, `${product.name} has been deleted`);
    } catch (error) {
        next(error);
    }
}

export {
    create,
    find,
    index,
    remove,
    update
}