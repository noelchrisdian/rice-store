import jwt from 'jsonwebtoken'

import { Forbidden } from '../error/forbidden.error.js'
import { JWT_SECRET } from '../../core/config.js'
import { Unauthorized } from '../error/unauthorized.error.js'

const authenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) throw new Unauthorized('Authentication failed, please sign in again')

    const payload = jwt.verify(token, JWT_SECRET)
    req.user = {
      id: payload.id,
      role: payload.role
    }

    next()
  } catch (error) {
    next(error)
  }
}

const authorize = (role) => (req, res, next) => {
  if (req?.user?.role === role) {
    return next()
  }

  throw new Forbidden(
    `Only ${role === 'admin' ? 'administrators' : 'customers'} can access this resources`
  )
}

export { authenticated, authorize }
