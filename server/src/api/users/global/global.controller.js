import {
  FindGlobalProductHelper,
  GetGlobalProductsHelper,
  GetGlobalProductReviewsHelper,
  GetGlobalReviewsHelper
} from './global.helper.js'
import { SendSuccess } from '../../../shared/utils/response.utils.js'

const GetGlobalProducts = async (req, res, next) => {
  try {
    const products = await GetGlobalProductsHelper()
    SendSuccess(res, products, 'Products fetched successfully')
  } catch (error) {
    next(error)
  }
}

const FindGlobalProduct = async (req, res, next) => {
  try {
    const product = await FindGlobalProductHelper(req)
    SendSuccess(res, product, `${product.name} fetched successfully`)
  } catch (error) {
    next(error)
  }
}

const GetGlobalReviews = async (req, res, next) => {
  try {
    const reviews = await GetGlobalReviewsHelper()
    SendSuccess(res, reviews, 'Reviews fetched successfully')
  } catch (error) {
    next(error)
  }
}

const GetGlobalProductReviews = async (req, res, next) => {
  try {
    const reviews = await GetGlobalProductReviewsHelper(req)
    SendSuccess(res, reviews, 'Reviews fetched successfully')
  } catch (error) {
    next(error)
  }
}

export { FindGlobalProduct, GetGlobalProducts, GetGlobalProductReviews, GetGlobalReviews }
