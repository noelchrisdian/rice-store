import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import { createServer } from 'http'

import { authenticated, authorize } from './shared/middleware/auth.middleware.js'
import { connectDB } from './core/db.js'
import { errorHandler } from './shared/middleware/error_handler.middleware.js'
import { init } from './shared/service/socket_io.service.js'
import { limiter } from './shared/middleware/limiter.middleware.js'
import { NODE_ENV, PORT } from './core/config.js'
import { notification } from './api/order/order.controller.js'
import { router as adminRouter } from './api/users/admin/admin.router.js'
import { router as authRouter } from './api/users/auth/auth.router.js'
import { router as customerRouter } from './api/users/customer/customer.router.js'
import { router as globalRouter } from './api/users/global/global.router.js'

const app = express()
const port = PORT

const server = createServer(app)
init(server)

connectDB()

app
  .set('trust proxy', 1)
  .use(json())
  .use(urlencoded({ extended: true }))
  .use(express.static('public'))
  .use(cookieParser())
  .use(
    cors({
      origin:
        NODE_ENV === 'production' ? 'https://tokoberasad.up.railway.app' : 'http://localhost:5173',
      credentials: true
    })
  )

app
  .get('/', (req, res) => {
    res.send('Welcome to AD Rice Store API')
  })
  .get('/me', authenticated, (req, res) => {
    res.json({
      id: req.user.id,
      role: req.user.role
    })
  })

app.post('/midtrans-notification', notification)

app
  .use(limiter)
  .use('/', authRouter)
  .use('/', globalRouter)
  .use('/admin', authenticated, authorize('admin'), adminRouter)
  .use('/customers', authenticated, authorize('customer'), customerRouter)
  .use(errorHandler)

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
