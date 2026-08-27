import { Router } from 'express'

import { findProduct, indexProducts, indexReviews, productReviews } from './global.controller.js'

const router = Router()

router
  .get('/products', indexProducts)
  .get('/products/:id', findProduct)
  .get('/products/:id/reviews', productReviews)
  .get('/reviews', indexReviews)

export { router }
