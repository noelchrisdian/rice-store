import { rateLimit } from 'express-rate-limit'

const CartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  statusCode: 429,
  message: {
    data: null,
    status: 'failed',
    message: 'Terlalu banyak request, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 64
})

const Limiter = rateLimit({
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

const SignInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  statusCode: 429,
  message: {
    data: null,
    status: 'failed',
    message: 'Terlalu banyak request, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 64
})

export { CartLimiter, Limiter, SignInLimiter }
