import { Router } from 'express'

import { cancel, create as createOrder, find, index } from './order.controller.js'
import { CreateReview } from '../review/review.controller.js'

const router = Router()

router
  .get('/', index)
  .get('/:id', find)
  .get('/:id/invoice', find)
  .post('/', createOrder)
  .post('/:id/cancel-order', cancel)
  .post('/:orderId/products/:productId/review', CreateReview)

export { router }
