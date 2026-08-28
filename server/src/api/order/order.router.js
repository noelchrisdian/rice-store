import { Router } from 'express'

import { CancelOrder, CreateOrder, FindOrder, GetOrders } from './order.controller.js'
import { CreateReview } from '../review/review.controller.js'

const router = Router()

router
  .get('/', GetOrders)
  .get('/:id', FindOrder)
  .get('/:id/invoice', FindOrder)
  .post('/', CreateOrder)
  .post('/:id/cancel-order', CancelOrder)

  .post('/:orderId/products/:productId/review', CreateReview)

export { router }
