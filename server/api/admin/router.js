import {
    findOrder,
    indexOrders,
    indexUsers
} from './controller.js';
import { Router } from 'express';
import { router as productRouter } from '../products/router.js';

const router = Router();

router
    .get('/orders', indexOrders)
    .get('/orders/:id', findOrder)
    .get('/users', indexUsers)
    .use('/products', productRouter)

export {
    router
}