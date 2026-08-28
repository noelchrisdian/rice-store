import { StatusCodes } from 'http-status-codes'

import { CreateReviewHelper } from './review.helper.js'
import { IdSchema } from '../../shared/utils/id_schema.utils.js'
import { ReviewSchema } from './review.schema.js'
import { SendSuccess } from '../../shared/utils/response.utils.js'
import { ValidationInput } from '../../shared/utils/input_validation.utils.js'

const CreateReview = async (req, res, next) => {
  try {
    const { orderId, productId } = await ValidationInput(IdSchema, req.params)
    const data = await ValidationInput(ReviewSchema, req.body)
    const review = await CreateReviewHelper({
      data,
      orderId,
      productId,
      user: req.user
    })
    SendSuccess(res, review, 'Review has been created', StatusCodes.CREATED)
  } catch (error) {
    next(error)
  }
}

export { CreateReview }
