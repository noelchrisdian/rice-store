import { Router } from 'express'

import { Authenticated } from '../../../shared/middleware/auth.middleware.js'
import { SignIn, SignOut, SignUp, UpdateUser } from './auth.controller.js'
import { SignInLimiter } from '../../../shared/middleware/limiter.middleware.js'
import { upload } from '../../../shared/service/multer.service.js'

const router = Router()

router
  .post('/sign-in', SignInLimiter, SignIn)
  .post('/sign-out', SignOut)
  .post('/sign-up', SignInLimiter, upload.single('image'), SignUp)
  .put('/change-profile', Authenticated, upload.single('image'), UpdateUser)

export { router }
