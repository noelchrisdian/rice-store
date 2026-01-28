import {
    findOrder,
    findUser,
    indexOrders,
    indexUsers
} from './controller.js';
import { invoice } from '../orders/controller.js';
import { Router } from 'express';
import { router as productRouter } from '../products/router.js';

const router = Router();

router
    .get('/orders', indexOrders)
    .get('/orders/:id', findOrder)
    .get('/orders/:id/invoice', invoice)
    .get('/users', indexUsers)
    .get('/user', findUser)
    .use('/products', productRouter)

export {
    router
}