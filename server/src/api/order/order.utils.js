import dayjs from 'dayjs'
import midtransClient from 'midtrans-client'

import { BadRequest } from '../../shared/error/bad_request.error.js'
import { CartModel as Carts } from '../cart/cart.model.js'
import { InventoryModel as Inventories } from '../inventory/inventory.model.js'
import { MIDTRANS_CONFIG } from '../../core/config.js'

// *************** GET ORDERS HELPER ***************
const OrderFilterOptions = (range, status, user) => {
  const filter = { user: user.id }
  if (status) {
    switch (status) {
      case 'pending':
        filter['payment.status'] = 'pending'
        break
      case 'failed':
        filter['payment.status'] = { $in: ['deny', 'cancel', 'failure', 'expire'] }
        break
      case 'processing':
      case 'shipped':
      case 'delivered':
        filter['payment.status'] = { $in: ['settlement', 'capture'] }
        filter['shipping.status'] = status
        break
    }
  }

  if (range) {
    let startDate
    const endDate = dayjs().endOf('day').toDate()

    switch (range) {
      case 'today':
        startDate = dayjs().startOf('day').toDate()
        break
      case '7d':
        startDate = dayjs().subtract(7, 'day').startOf('day').toDate()
        break
      case '30d':
        startDate = dayjs().subtract(30, 'day').startOf('day').toDate()
        break
      case '90d':
        startDate = dayjs().subtract(90, 'day').startOf('day').toDate()
        break
      default:
        break
    }

    if (startDate) {
      filter.createdAt = { $gte: startDate, $lte: endDate }
    }
  }

  return filter
}

// *************** CREATE ORDER HELPERS ***************
const GetCart = async (user, session) => {
  const cart = await Carts.findOne({ user: user.id })
    .populate({
      path: 'products.product',
      select: 'name price stock weightPerUnit'
    })
    .session(session)
  if (!cart || cart.products.length === 0) throw new BadRequest('CART NOT FOUND OR EMPTY')

  return cart
}

const CreateReservedStocks = async (cart, productIds, session) => {
  const inventories = await Inventories.find({
    product: { $in: productIds },
    remaining: { $gt: 0 },
    status: 'available'
  })
    .sort({ receivedAt: 1 })
    .session(session)
  const inventoriesMap = {}
  for (const inventory of inventories) {
    const key = String(inventory.product)
    if (!inventoriesMap[key]) inventoriesMap[key] = []
    inventoriesMap[key].push(inventory)
  }

  const reservedStocks = []
  for (const product of cart.products) {
    const id = String(product.product._id)
    const productInventories = inventoriesMap[id] || []
    let requiredKg = product.quantity * product.product.weightPerUnit
    const totalStock = productInventories.reduce((acc, inventory) => acc + inventory.remaining, 0)

    if (requiredKg > totalStock)
      throw new BadRequest(`Stok tidak mencukupi untuk ${product.product.name}`)

    for (const inventory of productInventories) {
      if (requiredKg <= 0) break

      const take = Math.min(inventory.remaining, requiredKg)
      if (take <= 0) continue

      const updated = await Inventories.findOneAndUpdate(
        { _id: inventory._id, remaining: { $gte: take } },
        {
          $inc: { remaining: -take },
          $set: { status: inventory.remaining - take <= 0 ? 'depleted' : 'available' }
        },
        { session, new: true }
      )

      if (!updated) {
        throw new BadRequest(`Stok tidak mencukupi untuk ${product.product.name}`)
      }

      requiredKg -= take
      reservedStocks.push({
        inventory: inventory._id,
        quantity: take
      })
    }
  }

  return reservedStocks
}

const CreateMidtransSnap = async (order, user) => {
  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: MIDTRANS_CONFIG.SERVER_KEY
  })

  const clientURL = `${MIDTRANS_CONFIG.CLIENT_URL}/orders/confirmation?order_id=${order._id}`
  const parameter = {
    transaction_details: {
      order_id: String(order._id),
      gross_amount: order.totalPrice
    },
    customer_details: {
      first_name: user.name,
      email: user.email,
      phone: user.phoneNumber,
      billing_address: {
        first_name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address
      },
      shipping_address: {
        first_name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address
      }
    },
    item_details: order.products.map((product) => ({
      id: product.product._id,
      name: product.product.name,
      quantity: product.quantity,
      price: product.product.price,
      merchant_name: 'Toko Beras AD',
      url: `${MIDTRANS_CONFIG.CLIENT_URL}/products/${product.product._id}`
    })),
    callbacks: {
      finish: clientURL
    },
    gopay: {
      enable_callback: true,
      callback_url: clientURL
    },
    shopeepay: {
      callback_url: clientURL
    }
  }

  try {
    return await snap.createTransaction(parameter)
  } catch (error) {
    console.error(`SNAP ERROR: ${error}`)
    throw new BadRequest('PAYMENT PROCESS FAILED')
  }
}

// *************** CANCEL ORDER HELPERS ***************
const InitializeMidtransClient = () => {
  return new midtransClient.Snap({
    isProduction: false,
    serverKey: MIDTRANS_CONFIG.SERVER_KEY,
    clientKey: MIDTRANS_CONFIG.CLIENT_KEY
  })
}

const RestoreReservedStocks = async (order, session) => {
  for (const item of order.reservedStocks) {
    await Inventories.updateOne(
      { _id: item.inventory },
      {
        $inc: { remaining: item.quantity },
        $set: { status: 'available' }
      },
      { session }
    )
  }

  order.reservedStocks = []
}

export {
  CreateMidtransSnap,
  CreateReservedStocks,
  GetCart,
  InitializeMidtransClient,
  OrderFilterOptions,
  RestoreReservedStocks
}
