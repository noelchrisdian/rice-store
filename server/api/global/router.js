import {
    findProduct,
    indexProducts,
    indexReviews,
    productReviews
} from './controller.js';
import { Router } from 'express';

const router = Router();

router
    .get('/products', indexProducts)
    .get('/products/:id', findProduct)
    .get('/products/:id/reviews', productReviews)
    .get('/reviews', indexReviews)

export {
    router
}