import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

import { AdminOrdersPipeline, ReviewAnalytics } from './admin.utils.js'
import { BadRequest } from '../../../shared/error/bad_request.error.js'
import { cloudinaryUploader } from '../../../shared/service/multer.service.js'
import { escape } from '../../../shared/utils/escape_characters.utils.js'
import { NotFound } from '../../../shared/error/not_found.error.js'
import { OrderModel as Orders } from '../../order/order.model.js'
import { ProductModel as Products } from '../../product/product.model.js'
import { ReviewModel as Reviews } from '../../review/review.model.js'
import { UserModel as Users } from '../user.model.js'

const GetOrdersHelper = async ({ limit, page, range, search, status }) => {
  const skip = (page - 1) * limit
  const pipeline = AdminOrdersPipeline(range, search, status)

  const [orders, totalAggregate] = await Promise.all([
    Orders.aggregate([
      ...pipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]),
    Orders.aggregate([...pipeline, { $count: 'total' }])
  ])

  const total = totalAggregate[0]?.total || 0

  return {
    orders,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

const FindOrderHelper = async (id) => {
  const order = await Orders.findById(id)
    .populate('products.product', 'name image price')
    .populate('user', 'name phoneNumber email address')
    .lean()
  if (!order) throw new NotFound(`ORDER NOT EXIST`)

  return order
}

const GetReviewsHelper = async ({ id, limit, page }) => {
  const product = await Products.findById(id)
  if (!product) throw new NotFound(`PRODUCT NOT EXIST`)

  const skip = (page - 1) * limit

  const [reviews, total, statistic] = await Promise.all([
    Reviews.find({ product: id })
      .select('user rating comment createdAt deleted')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar')
      .lean(),
    Reviews.countDocuments({ product: id }),
    Reviews.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          total: { $sum: 1 },
          star5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          star1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
        }
      }
    ])
  ])

  const analytics = ReviewAnalytics(statistic)
  const totalPages = Math.ceil(total / limit)

  return {
    reviews,
    analytics,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  }
}

const GetUsersHelper = async ({ limit, page, search }) => {
  const skip = (page - 1) * limit
  const filter = {}
  filter.role = 'customer'

  if (search) {
    const keyword = escape(search.trim())

    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } }
    ]
  }

  const [users, total] = await Promise.all([
    Users.find(filter)
      .select('name phoneNumber email address createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Users.countDocuments(filter)
  ])

  const totalPages = Math.ceil(total / limit)
  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  }
}

const FindUserHelper = async ({ reqUser }) => {
  const user = await Users.findById(reqUser.id).lean()
  if (!user) throw new NotFound(`USER NOT EXIST`)

  return user
}

const UpdateOrderShippedHelper = async ({ data, file, id }) => {
  if (!file) throw new BadRequest('IMAGE IS REQUIRED')
  let uploadImage

  try {
    const order = await Orders.findById(id)
    if (!order) throw new NotFound(`ORDER NOT EXIST`)
    if (order.shipping?.status !== 'processing')
      throw new BadRequest(`ONLY ORDERS WITH STATUS PROCESSING CAN BE MARKED AS SHIPPED`)

    uploadImage = await cloudinaryUploader(file.buffer, 'deliveries')

    return await Orders.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          'shipping.status': 'shipped',
          'shipping.courier': data.courier,
          'shipping.fee': data.fee,
          'shipping.trackingNumber': data.trackingNumber,
          'shipping.shippedAt': data.shippedAt,
          'shipping.proofImage': {
            imageURL: uploadImage.secure_url,
            imagePublicID: uploadImage.public_id
          }
        }
      },
      { new: true }
    )
  } catch (error) {
    if (uploadImage?.public_id) {
      await cloudinary.uploader.destroy(uploadImage.public_id)
    }
    throw error
  }
}

const UpdateOrderShippedInfoHelper = async ({ data, id }) => {
  const order = await Orders.findById(id)
  if (!order) throw new NotFound(`ORDER NOT EXIST`)

  if (order.shipping.status !== 'shipped') {
    throw new BadRequest('SHIPPING INFO CAN ONLY BE EDITED FOR SHIPPED ORDERS')
  }

  return await Orders.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        'shipping.courier': data.courier,
        'shipping.fee': data.fee,
        'shipping.trackingNumber': data.trackingNumber,
        'shipping.shippedAt': data.shippedAt
      }
    },
    { new: true }
  )
}

const UpdateOrderDeliveredHelper = async ({ data, file, id }) => {
  if (!file) throw new BadRequest('IMAGE IS REQUIRED')
  let uploadImage

  try {
    const order = await Orders.findById(id)
    if (!order) throw new NotFound(`ORDER NOT EXIST`)

    if (order.shipping?.status !== 'shipped') {
      throw new BadRequest(`ONLY ORDERS WITH STATUS SHIPPED CAN BE MARKED AS DELIVERED`)
    }

    uploadImage = await cloudinaryUploader(file.buffer, 'deliveries')
    const oldPublicID = order.shipping?.proofImage?.imagePublicID
    const updated = await Orders.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          'shipping.status': 'delivered',
          'shipping.deliveredAt': data.deliveredAt,
          'shipping.proofImage': {
            imageURL: uploadImage.secure_url,
            imagePublicID: uploadImage.public_id
          }
        }
      },
      { new: true }
    )

    if (updated && oldPublicID) {
      await cloudinary.uploader.destroy(oldPublicID)
    }

    return updated
  } catch (error) {
    if (uploadImage?.public_id) {
      await cloudinary.uploader.destroy(uploadImage.public_id)
    }
    throw error
  }
}

const UpdateReviewStatusHelper = async ({ reviewId }) => {
  const review = await Reviews.findOneAndUpdate(
    { _id: reviewId },
    [{ $set: { deleted: { $not: '$deleted' } } }],
    { new: true }
  )
    .populate('product', 'name')
    .populate('user', 'name')
  if (!review) throw new NotFound(`Review doesn't exist`)

  return review
}

export {
  FindOrderHelper,
  GetOrdersHelper,
  GetReviewsHelper,
  FindUserHelper,
  GetUsersHelper,
  UpdateOrderDeliveredHelper,
  UpdateOrderShippedHelper,
  UpdateOrderShippedInfoHelper,
  UpdateReviewStatusHelper
}
