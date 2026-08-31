import { Router } from 'express'

import { FindUser } from '../admin/admin.controller.js'
import { router as CartRouter } from '../../cart/cart.router.js'
import { router as OrderRouter } from '../../order/order.router.js'

const router = Router()

router.get('/user', FindUser).use('/cart', CartRouter).use('/orders', OrderRouter)

export { router }
