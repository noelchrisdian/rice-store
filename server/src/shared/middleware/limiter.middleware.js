import { rateLimit } from 'express-rate-limit'

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

export { limiter }
