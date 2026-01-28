import {
    cancel,
    create as createOrder,
    find,
    index,
    invoice
} from "./controller.js";
import { create as createReview } from "../reviews/controller.js";
import { Router } from "express";

const router = Router();

router
    .get('/', index)
    .get('/:id', find)
    .get('/:id/invoice', invoice)
    .post('/', createOrder)
    .post('/:id/cancel-order', cancel)
    .post('/:orderID/products/:productID/review', createReview)

export {
    router
}