import { StatusCodes } from 'http-status-codes'

import {
  CancelOrderHelper,
  CreateOrderHelper,
  FindOrderHelper,
  GetOrdersHelper,
  MidtransWebhookHelper
} from './order.helper.js'
import { IdSchema } from '../../shared/utils/id_schema.utils.js'
import { SendSuccess } from '../../shared/utils/response.utils.js'
import { ValidationInput } from '../../shared/utils/input_validation.utils.js'

const GetOrders = async (req, res, next) => {
  try {
    const { limit, page, range, status } = req.query
    const orders = await GetOrdersHelper({
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      range: String(range),
      status: String(status),
      user: req.user
    })
    SendSuccess(res, orders, 'Orders fetched successfully')
  } catch (error) {
    next(error)
  }
}

const FindOrder = async (req, res, next) => {
  try {
    const { id } = await ValidationInput(IdSchema, req.params)
    const order = await FindOrderHelper(id)
    SendSuccess(res, order, 'Order fetched successfully')
  } catch (error) {
    next(error)
  }
}

const CreateOrder = async (req, res, next) => {
  try {
    const order = await CreateOrderHelper({ reqUser: req.user })
    SendSuccess(res, order, 'Order has been created', StatusCodes.CREATED)
  } catch (error) {
    next(error)
  }
}

const CancelOrder = async (req, res, next) => {
  try {
    const { id } = await ValidationInput(IdSchema, req.params)
    const order = await CancelOrderHelper(id)
    SendSuccess(res, order, 'Order has been cancelled')
  } catch (error) {
    next(error)
  }
}

const MidtransWebhook = async (req, res, next) => {
  try {
    const order = await MidtransWebhookHelper({ data: req.body })
    SendSuccess(res, order, 'Payment successful')
  } catch (error) {
    next(error)
  }
}

export { CancelOrder, CreateOrder, FindOrder, GetOrders, MidtransWebhook }
