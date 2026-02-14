import {
    findOrder,
    findUser,
    indexOrders,
    indexUsers,
    updateDelivered,
    updateShipped,
    updateShippedInfo
} from './controller.js';
import { Router } from 'express';
import { router as productRouter } from '../products/router.js';
import { upload } from '../../utils/multer.js';

const router = Router();

router
    .get('/orders', indexOrders)
    .get('/orders/:id', findOrder)
    .get('/orders/:id/invoice', findOrder)
    .patch('/orders/:id/delivered', upload.single('image'), updateDelivered)
    .patch('/orders/:id/shipped', upload.single('image'), updateShipped)
    .patch('/orders/:id/edit-shipping', updateShippedInfo)
    .get('/users', indexUsers)
    .get('/user', findUser)
    .use('/products', productRouter)

export {
    router
}