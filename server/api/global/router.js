import {
    findProduct,
    indexProduct,
    indexReview
} from './controller.js';
import { Router } from 'express';

const router = Router();

router
    .get('/products', indexProduct)
    .get('/products/:id', findProduct)
    .get('/products/:id/reviews', indexReview)

export {
    router
}