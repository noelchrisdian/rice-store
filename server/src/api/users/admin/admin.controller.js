import {
  FindOrderHelper,
  FindUserHelper,
  GetOrdersHelper,
  GetReviewsHelper,
  GetUsersHelper,
  UpdateOrderDeliveredHelper,
  UpdateOrderShippedHelper,
  UpdateOrderShippedInfoHelper,
  UpdateReviewStatusHelper
} from './admin.helper.js'
import {
  GetRecentOrdersHelper,
  GetRecentProductsHelper,
  GetRecentUsersHelper,
  GetTodayOrdersHelper,
  GetUserStatsHelper
} from './admin.dashboard.helper.js'
import { IdSchema } from '../../../shared/utils/id_schema.utils.js'
import { OrderDeliveredSchema, OrderShippedSchema } from './admin.order.schema.js'
import { SendSuccess } from '../../../shared/utils/response.utils.js'
import { ValidationInput } from '../../../shared/utils/input_validation.utils.js'

const GetOrders = async (req, res, next) => {
  try {
    const { limit, page, range, search, status } = req.query
    const result = await GetOrdersHelper({
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      range: String(range),
      search: String(search),
      status: String(status)
    })
    SendSuccess(res, result, 'Orders fetched successfully')
  } catch (error) {
    next(error)
  }
}

const GetTodayOrders = async (req, res, next) => {
  try {
    const orders = await GetTodayOrdersHelper()
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

const GetReviews = async (req, res, next) => {
  try {
    const { limit, page } = req.query
    const { id } = await ValidationInput(IdSchema, req.params)
    const result = await GetReviewsHelper({
      id,
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1
    })
    SendSuccess(res, result, 'Reviews fetched successfully')
  } catch (error) {
    next(error)
  }
}

const GetUsers = async (req, res, next) => {
  try {
    const { limit, page, search } = req.query
    const result = await GetUsersHelper({
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      search: String(search)
    })
    SendSuccess(res, result, 'Users fetched successfully')
  } catch (error) {
    next(error)
  }
}

const FindUser = async (req, res, next) => {
  try {
    const user = await FindUserHelper({ reqUser: req.user })
    SendSuccess(res, user, 'User fetched successfully')
  } catch (error) {
    next(error)
  }
}

const UpdateShipped = async (req, res, next) => {
  try {
    const { id } = await ValidationInput(IdSchema, req.params)
    const data = await ValidationInput(OrderShippedSchema, req.body)
    const order = await UpdateOrderShippedHelper({
      data,
      file: req.file,
      id
    })
    SendSuccess(res, order, 'Order updated successfully')
  } catch (error) {
    next(error)
  }
}

const UpdateShippedInfo = async (req, res, next) => {
  try {
    const { id } = await ValidationInput(IdSchema, req.params)
    const data = await ValidationInput(OrderShippedSchema, req.body)
    const order = await UpdateOrderShippedInfoHelper({
      data,
      id
    })
    SendSuccess(res, order, 'Order updated successfully')
  } catch (error) {
    next(error)
  }
}

const UpdateDelivered = async (req, res, next) => {
  try {
    const { id } = await ValidationInput(IdSchema, req.params)
    const data = await ValidationInput(OrderDeliveredSchema, req.body)
    const order = await UpdateOrderDeliveredHelper({
      data,
      file: req.file,
      id
    })
    SendSuccess(res, order, 'Order updated successfully')
  } catch (error) {
    next(error)
  }
}

const UpdateReviewStatus = async (req, res, next) => {
  try {
    const { reviewId } = await ValidationInput(IdSchema, req.params)
    const review = await UpdateReviewStatusHelper({ reviewId })
    SendSuccess(
      res,
      review,
      review.deleted
        ? `Review by ${review.user.name} on ${review.product.name} has been deleted`
        : `Review by ${review.user.name} on ${review.product.name} has been restored`
    )
  } catch (error) {
    next(error)
  }
}

const GetRecentOrders = async (req, res, next) => {
  try {
    const orders = await GetRecentOrdersHelper()
    SendSuccess(res, orders, 'Orders fetched successfully')
  } catch (error) {
    next(error)
  }
}

const GetRecentProducts = async (req, res, next) => {
  try {
    const products = await GetRecentProductsHelper()
    SendSuccess(res, products, 'Products fetched successfully')
  } catch (error) {
    next(error)
  }
}

const GetRecentUsers = async (req, res, next) => {
  try {
    const users = await GetRecentUsersHelper()
    SendSuccess(res, users, 'Users fetched successfully')
  } catch (error) {
    next(error)
  }
}

const GetUserStats = async (req, res, next) => {
  try {
    const user = await GetUserStatsHelper()
    SendSuccess(res, user, 'User fetched successfully')
  } catch (error) {
    next(error)
  }
}

export {
  FindOrder,
  FindUser,
  GetOrders,
  GetReviews,
  GetRecentOrders,
  GetRecentProducts,
  GetRecentUsers,
  GetUsers,
  GetUserStats,
  GetTodayOrders,
  UpdateDelivered,
  UpdateReviewStatus,
  UpdateShipped,
  UpdateShippedInfo
}
