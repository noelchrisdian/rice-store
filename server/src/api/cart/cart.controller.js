import { AddItemHelper, GetCartHelper, UpdateCartHelper } from './cart.helper.js'
import { CartSchema } from './cart.schema.js'
import { SendSuccess } from '../../shared/utils/response.utils.js'
import { ValidationInput } from '../../shared/utils/input_validation.utils.js'

const GetCart = async (req, res, next) => {
  try {
    const data = await GetCartHelper({ user: req.user })
    SendSuccess(res, data, 'Cart fetched successfully')
  } catch (error) {
    next(error)
  }
}

const AddItem = async (req, res, next) => {
  try {
    const data = await ValidationInput(CartSchema, req.body)
    const cart = await AddItemHelper({
      data,
      user: req.user
    })
    SendSuccess(res, cart, `${cart.products.length > 1 ? 'Items' : 'Item'} added to cart`)
  } catch (error) {
    next(error)
  }
}

const UpdateCart = async (req, res, next) => {
  try {
    const data = await ValidationInput(CartSchema, req.body)
    const cart = await UpdateCartHelper({
      data,
      user: req.user
    })
    SendSuccess(res, cart, `${cart.products.length > 1 ? 'Items' : 'Item'} quantity has updated`)
  } catch (error) {
    next(error)
  }
}

export { AddItem, GetCart, UpdateCart }
