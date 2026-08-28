import { Router } from 'express'

import { AddItem, GetCart, UpdateCart } from './cart.controller.js'
import { CartLimiter } from '../../shared/middleware/limiter.middleware.js'

const router = Router()

router.get('/', GetCart).post('/', AddItem).patch('/', CartLimiter, UpdateCart)

export { router }
