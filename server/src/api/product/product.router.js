import { Router } from 'express'

import {
  CreateProduct,
  DeleteProduct,
  FindProduct,
  GetProducts,
  UpdateProduct
} from './product.controller.js'
import { indexReviews, updateReview } from '../users/admin/admin.controller.js'
import { router as InventoryRouter } from '../inventory/inventory.router.js'
import { upload } from '../../shared/service/multer.service.js'

const router = Router()

router
  .get('/', GetProducts)
  .get('/:id', FindProduct)
  .post('/', upload.single('image'), CreateProduct)
  .put('/:id', upload.single('image'), UpdateProduct)
  .delete('/:id', DeleteProduct)

  .get('/:id/reviews', indexReviews)
  .patch('/:id/reviews/:reviewID', updateReview)

  .use('/', InventoryRouter)

export { router }
