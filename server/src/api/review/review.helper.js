import mongoose from 'mongoose'

import { BadRequest } from '../../shared/error/bad_request.error.js'
import { Forbidden } from '../../shared/error/forbidden.error.js'
import { NotFound } from '../../shared/error/not_found.error.js'
import { OrderModel as Orders } from '../order/order.model.js'
import { ReviewModel as Reviews } from './review.model.js'

const CreateReviewHelper = async ({ data, orderId, productId, user }) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const order = await Orders.findOne({ _id: orderId, user: user.id }).session(session)
    if (!order) {
      throw new NotFound(`ORDER NOT EXIST`)
    }
    if (order.shipping.status !== 'delivered') {
      throw new Forbidden(`ORDER NOT COMPLETED YET`)
    }

    const item = order.products.find((p) => p.product.toString() === productId.toString())
    if (!item) {
      throw new BadRequest(`PRODUCT NOT EXIST`)
    }
    if (item.reviewed) {
      throw new BadRequest(`PRODUCT REVIEWED`)
    }

    const existing = await Reviews.findOne({
      product: productId,
      order: orderId,
      user: user.id
    }).session(session)
    if (existing) {
      throw new BadRequest('REVIEW EXISTED')
    }

    const [review] = await Reviews.create(
      [
        {
          user: user.id,
          product: productId,
          order: orderId,
          rating: data.rating,
          comment: data.comment
        }
      ],
      { session }
    )

    const updatedOrder = await Orders.findOneAndUpdate(
      { _id: orderId, 'products.product': new mongoose.Types.ObjectId(productId) },
      { $set: { 'products.$.reviewed': true } },
      { new: true, session }
    )
    if (!updatedOrder) {
      throw new BadRequest('FAILED TO UPDATE ORDER REVIEWED STATUS')
    }
    await session.commitTransaction()

    return review
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export { CreateReviewHelper }
