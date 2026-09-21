import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import { createServer } from 'http'

import { Authenticated, Authorize } from './shared/middleware/auth.middleware.js'
import { ConnectDB } from './core/db.ts'
import { ErrorHandler } from './shared/middleware/error_handler.middleware.js'
import { InitializeWebsocket } from './shared/service/socket_io.service.js'
import { Limiter } from './shared/middleware/limiter.middleware.js'
import { MidtransWebhook } from './api/order/order.controller.js'
import { NODE_ENV, PORT } from './core/config.ts'
import { router as AdminRouter } from './api/users/admin/admin.router.js'
import { router as AuthRouter } from './api/users/auth/auth.router.js'
import { router as CustomerRouter } from './api/users/customer/customer.router.js'
import { router as GlobalRouter } from './api/users/global/global.router.js'

const app = express()
const port = PORT

const server = createServer(app)
InitializeWebsocket(server)

ConnectDB()

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
  .get('/me', Authenticated, (req, res) => {
    res.json({
      id: req.user.id,
      role: req.user.role
    })
  })

app.post('/midtrans-notification', MidtransWebhook)

app
  .use(Limiter)
  .use('/', AuthRouter)
  .use('/', GlobalRouter)
  .use('/admin', Authenticated, Authorize('admin'), AdminRouter)
  .use('/customers', Authenticated, Authorize('customer'), CustomerRouter)
  .use(ErrorHandler)

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
