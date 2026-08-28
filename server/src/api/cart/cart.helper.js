import { CartModel as Carts } from './cart.model.js'
import { NotFound } from '../../shared/error/not_found.error.js'

const GetCartHelper = async ({ user }) => {
  const cart = await Carts.findOne({ user: user.id }).populate({
    path: 'products.product',
    select: 'name price image inventories weightPerUnit',
    populate: {
      path: 'inventories',
      select: 'remaining'
    }
  })

  if (!cart) {
    return {
      user: user.id,
      products: [],
      total: 0
    }
  }

  const total = cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  return {
    ...cart.toObject(),
    total
  }
}

const AddItemHelper = async ({ data, user }) => {
  const cart = await Carts.findOne({ user: user.id })
  if (!cart) {
    return await Carts.create({
      user: user.id,
      products: data.products
    })
  }

  for (const product of data.products) {
    const exist = cart.products.find((item) => item.product.toString() === product.product)
    if (exist) {
      exist.quantity += product.quantity
    } else {
      cart.products.push({ product: product.product, quantity: product.quantity })
    }
  }
  await cart.save()

  return cart
}

const UpdateCartHelper = async ({ data, user }) => {
  const cart = await Carts.findOne({ user: user.id })
  if (!cart) {
    throw new NotFound('CART NOT EXIST')
  }

  for (const product of data.products) {
    const exist = cart.products.find((item) => item.product.toString() === product.product)
    if (!exist) {
      throw new NotFound('PRODUCT NOT EXIST')
    }

    if (product.quantity === 0) {
      cart.products = cart.products.filter((item) => item.product.toString() !== product.product)
    } else {
      exist.quantity = product.quantity
    }
  }
  await cart.save()

  return cart
}

export { AddItemHelper, GetCartHelper, UpdateCartHelper }
