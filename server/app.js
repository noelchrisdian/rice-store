import 'dotenv/config'
import { createServer } from 'http'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import { rateLimit } from 'express-rate-limit'

import { authenticated, authorize } from './middlewares/auth.js'
import { connectDB } from './utils/db.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { init } from './utils/socket.js'
import { NODE_ENV, PORT } from './core/config.js'
import { notification } from './api/orders/controller.js'
import { router as adminRouter } from './api/admin/router.js'
import { router as authRouter } from './api/auth/router.js'
import { router as customerRouter } from './api/customers/router.js'
import { router as globalRouter } from './api/global/router.js'

const app = express()
const port = PORT

const server = createServer(app)
init(server)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  statusCode: 429,
  message: {
    status: 'failed',
    data: null,
    message: 'Terlalu banyak request, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 64
})

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
