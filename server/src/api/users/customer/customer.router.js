import { Router } from 'express'

import { findUser } from '../admin/admin.controller.js'
import { router as cartRouter } from '../../cart/cart.router.js'
import { router as orderRouter } from '../../order/order.router.js'

const router = Router()

router.get('/user', findUser).use('/cart', cartRouter).use('/orders', orderRouter)

export { router }
