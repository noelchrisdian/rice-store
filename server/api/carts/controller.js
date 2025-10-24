import {
    addItem,
    getCart,
    updateCart
} from "../../services/carts.js";
import { success } from "../../utils/response.js";

const index = async (req, res, next) => {
    try {
        const data = await getCart(req);
        success(res, data, 'Cart fetched successfully');
    } catch (error) {
        next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const cart = await addItem(req);
        success(res, cart, `${cart.products.length > 1 ? 'Items' : 'Item'} added to cart`);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const cart = await updateCart(req);
        success(res, cart, `${cart.products.length > 1 ? 'Items' : 'Item'} quantity has updated`);
    } catch (error) {
        next(error);
    }
}

export {
    create,
    index,
    update
}