import { Router } from "express";
import { router as cartRouter } from "../carts/router.js";
import { router as orderRouter } from "../orders/router.js";

const router = Router();

router
    .use('/cart', cartRouter)
    .use('/orders', orderRouter)

export {
    router
}