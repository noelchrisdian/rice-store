import { cartModel as Carts } from "../api/carts/model.js";
import { cartSchema } from "../utils/zod.js";
import { NotFound } from "../errors/notFound.js";
import { ParseError } from "../errors/parseError.js";
import { StatusCodes } from "http-status-codes";

const getCart = async (req) => {
    const cart = await Carts.findOne({ user: req.user.id }).populate({
        path: 'products.product',
        select: 'name price image'
    })

    if (!cart) {
        return {
            user: req.user.id, 
            products: [],
            total: 0
        }
    }

    const total = cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

    return {
        ...cart.toObject(),
        total
    }
}

const addItem = async (req) => {
    const parse = await cartSchema.safeParseAsync(req.body);
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }

    const cart = await Carts.findOne({ user: req.user.id });
    if (!cart) {
        return await Carts.create({
            user: req.user.id,
            products: parse.data?.products
        })
    }

    for (const product of parse.data?.products) {
        const exist = cart.products.find((item) => item.product.toString() === product.product);
        if (exist) {
            exist.quantity += product.quantity;
        } else {
            cart.products.push({ product: product.product, quantity: product.quantity });
        }
    }
    await cart.save();

    return cart;
}

const updateCart = async (req) => {
    const parse = await cartSchema.safeParseAsync(req.body);
    if (!parse.success) {
        const errors = parse.error.issues.map((error) => error.message);
        throw new ParseError('Invalid data type', StatusCodes.BAD_REQUEST, errors);
    }

    const cart = await Carts.findOne({ user: req.user.id });
    if (!cart) {
        throw new NotFound('Cart not found');
    }

    for (const product of parse.data.products) {
        const exist = cart.products.find((item) => item.product.toString() === product.product);
        if (!exist) {
            throw new NotFound('Product not found in cart');
        }
    
        if (product.quantity === 0) {
            cart.products = cart.products.filter((item) => item.product.toString() !== product.product);
        } else {
            exist.quantity = product.quantity;
        }
    }
    await cart.save();

    return cart;
}

export {
    addItem,
    getCart,
    updateCart
}