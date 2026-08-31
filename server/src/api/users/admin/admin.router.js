import { Router } from 'express'

import {
  FindOrder,
  FindUser,
  GetOrders,
  GetRecentOrders,
  GetRecentProducts,
  GetRecentUsers,
  GetTodayOrders,
  GetUsers,
  GetUserStats,
  UpdateDelivered,
  UpdateShipped,
  UpdateShippedInfo
} from './admin.controller.js'
import { router as ProductRouter } from '../../product/product.router.js'
import { upload } from '../../../shared/service/multer.service.js'

const router = Router()

router
  .get('/orders', GetOrders)
  .get('/orders/:id', FindOrder)
  .get('/orders/:id/invoice', FindOrder)
  .patch('/orders/:id/delivered', upload.single('image'), UpdateDelivered)
  .patch('/orders/:id/shipped', upload.single('image'), UpdateShipped)
  .patch('/orders/:id/edit-shipping', UpdateShippedInfo)
  .get('/recent-orders', GetRecentOrders)
  .get('/recent-products', GetRecentProducts)
  .get('/recent-users', GetRecentUsers)
  .get('/user-stats', GetUserStats)
  .get('/today-orders', GetTodayOrders)
  .get('/users', GetUsers)
  .get('/user', FindUser)
  .use('/products', ProductRouter)

export { router }
