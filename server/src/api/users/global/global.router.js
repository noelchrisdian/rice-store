import { Router } from 'express'

import {
  FindGlobalProduct,
  GetGlobalProducts,
  GetGlobalProductReviews,
  GetGlobalReviews
} from './global.controller.js'

const router = Router()

router
  .get('/products', GetGlobalProducts)
  .get('/products/:id', FindGlobalProduct)
  .get('/products/:id/reviews', GetGlobalProductReviews)
  .get('/reviews', GetGlobalReviews)

export { router }
