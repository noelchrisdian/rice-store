import mongoose from 'mongoose'

import { BadRequest } from '../../shared/error/bad_request.error.js'
import { CartModel as Carts } from '../cart/cart.model.js'
import {
  CreateMidtransSnap,
  CreateReservedStocks,
  GetCart,
  InitializeMidtransClient,
  OrderFilterOptions,
  RestoreReservedStocks
} from './order.utils.js'
import { Forbidden } from '../../shared/error/forbidden.error.js'
import { GetIO } from '../../shared/service/socket_io.service.js'
import { NotFound } from '../../shared/error/not_found.error.js'
import { OrderModel as Orders } from './order.model.js'
import { UserModel as Users } from '../users/user.model.js'

const GetOrdersHelper = async ({ limit, page, range, status, user }) => {
  const filter = OrderFilterOptions(range, status, user)
  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    Orders.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('products.product', 'name price image')
      .lean(),
    Orders.countDocuments(filter)
  ])

  const totalPages = Math.ceil(total / limit)
  return {
    orders,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  }
}

const FindOrderHelper = async (id) => {
  const order = await Orders.findById(id)
    .populate('products.product', 'name image price weightPerUnit')
    .populate('user', 'name phoneNumber email address')
    .lean()

  if (!order) {
    throw new NotFound(`ORDER NOT EXIST`)
  }

  return order
}

const CreateOrderHelper = async ({ reqUser }) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const cart = await GetCart(reqUser, session)
    const productIds = cart.products.map((product) => product.product._id)
    const reservedStocks = await CreateReservedStocks(cart, productIds, session)

    const [order] = await Orders.create(
      [
        {
          user: reqUser.id,
          products: cart.products.map((item) => {
            return {
              product: item.product._id,
              quantity: item.quantity
            }
          }),
          reservedStocks,
          totalPrice: cart.products.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
          ),
          payment: {
            method: 'midtrans',
            status: 'pending',
            expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000)
          },
          shipping: {
            status: 'pending'
          }
        }
      ],
      { session }
    )

    await Carts.updateOne({ _id: cart._id }, { $set: { products: [] } }, { session })
    await order.populate('products.product')

    const user = await Users.findById(reqUser.id).session(session)
    if (!user) {
      throw new NotFound(`USER NOT FOUND`)
    }

    const transaction = await CreateMidtransSnap(order, user)
    await Orders.updateOne(
      { _id: order._id },
      {
        $set: {
          'payment.midtransOrderID': String(order._id),
          'payment.midtransTransactionID': transaction?.token
        }
      },
      { session }
    )
    await session.commitTransaction()

    const io = GetIO()
    io.to('admin').emit('orders:event', {
      orderID: order._id,
      type: 'CREATED'
    })

    return {
      orderID: order._id,
      snap: transaction
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const MidtransWebhookHelper = async ({ data }) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  let event = null

  try {
    const client = InitializeMidtransClient()
    const statusResponse = await client.transaction.notification(data)
    const { order_id, transaction_id, transaction_status, fraud_status } = statusResponse
    const finalStatus = ['settlement', 'capture', 'cancel', 'deny', 'expire']

    const order = await Orders.findById(order_id).populate('products.product').session(session)
    if (!order) throw new NotFound('ORDER NOT FOUND')

    if (finalStatus.includes(order.payment.status)) {
      await session.commitTransaction()
      return order
    }

    if (
      transaction_status === 'settlement' ||
      (transaction_status === 'capture' && fraud_status === 'accept')
    ) {
      if (!['settlement', 'capture'].includes(order.payment.status)) {
        order.payment.status = transaction_status
        order.payment.paidAt = new Date()
        order.payment.midtransTransactionID = transaction_id
        order.shipping.status = 'processing'
        event = 'PAID'
      }
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      if (order.payment.status === 'pending' && order.reservedStocks.length > 0) {
        await RestoreReservedStocks(order, session)
      }

      order.payment.status = transaction_status
      order.payment.midtransTransactionID = transaction_id
      order.shipping.status = null
      event = 'CANCELLED'
    }

    await order.save({ session })
    await session.commitTransaction()

    if (event) {
      const io = GetIO()
      io.to('admin').emit('orders:event', {
        orderID: order._id,
        type: event
      })
    }

    return order
  } catch (error) {
    await session.abortTransaction()
    console.error(`WEBHOOK ERROR: ${error}`)
    throw error
  } finally {
    session.endSession()
  }
}

const CancelOrderHelper = async (id) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const order = await Orders.findById(id).session(session)
    if (!order) throw new NotFound('ORDER NOT FOUND')
    if (!order.user.equals(req.user.id)) throw new Forbidden('USER NOT AUTHORIZED')
    if (order.payment.status !== 'pending')
      throw new BadRequest(`ONLY PENDING ORDERS CAN BE CANCELLED`)

    const core = InitializeMidtransClient()

    if (order.payment.midtransOrderID) {
      try {
        await core.transaction.cancel(order.payment.midtransOrderID)
      } catch (error) {
        console.error(`MIDTRANS CANCEL ERROR : ${error}`)
      }
    }

    await RestoreReservedStocks(order, session)
    order.payment.status = 'cancel'
    order.shipping.status = null
    await order.save({ session })
    await session.commitTransaction()

    const io = GetIO()
    io.to('admin').emit('orders:event', {
      orderID: order._id,
      type: 'CANCELLED'
    })

    return order
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export {
  CancelOrderHelper,
  CreateOrderHelper,
  FindOrderHelper,
  GetOrdersHelper,
  MidtransWebhookHelper
}
