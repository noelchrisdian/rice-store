import {
    findOrder,
    findUser,
    indexOrders,
    indexRecentOrders,
    indexRecentProducts,
    indexRecentUsers,
    indexTodayOrders,
    indexUsers,
    updateDelivered,
    updateShipped,
    updateShippedInfo,
    userStats
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
    .get('/recent-orders', indexRecentOrders)
    .get('/recent-products', indexRecentProducts)
    .get('/recent-users', indexRecentUsers)
    .get('/user-stats', userStats)
    .get('/today-orders', indexTodayOrders)
    .get('/users', indexUsers)
    .get('/user', findUser)
    .use('/products', productRouter)

export {
    router
}