import { Router } from 'express'

import {
  CreateProduct,
  DeleteProduct,
  FindProduct,
  GetProducts,
  UpdateProduct
} from './product.controller.js'
import { GetReviews, UpdateReviewStatus } from '../users/admin/admin.controller.js'
import { router as InventoryRouter } from '../inventory/inventory.router.js'
import { upload } from '../../shared/service/multer.service.js'

const router = Router()

router
  .get('/', GetProducts)
  .get('/:id', FindProduct)
  .post('/', upload.single('image'), CreateProduct)
  .put('/:id', upload.single('image'), UpdateProduct)
  .delete('/:id', DeleteProduct)

  .get('/:id/reviews', GetReviews)
  .patch('/:id/reviews/:reviewId', UpdateReviewStatus)

  .use('/', InventoryRouter)

export { router }
