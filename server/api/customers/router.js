import { findUser } from "../admin/controller.js";
import { Router } from "express";
import { router as cartRouter } from "../carts/router.js";
import { router as orderRouter } from "../orders/router.js";

const router = Router();

router
    .get('/user', findUser)
    .use('/cart', cartRouter)
    .use('/orders', orderRouter)

export {
    router
}