import mongoose from 'mongoose'

import { InventoryModel as Inventories } from './inventory.model.js'
import { NotFound } from '../../shared/error/not_found.error.js'
import { ProductModel as Products } from '../product/product.model.js'

const GetInventoriesHelper = async ({ limit, page, productId }) => {
  const product = await Products.findOne({ _id: productId })
  if (!product) {
    throw new NotFound(`PRODUCT NOT EXIST`)
  }
  const skip = (page - 1) * limit

  const [inventories, total] = await Promise.all([
    Inventories.find({ product: productId }).sort({ receivedAt: 1 }).skip(skip).limit(limit).lean(),
    Inventories.countDocuments({ product: productId })
  ])

  const totalPages = Math.ceil(total / limit)
  return {
    inventories,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  }
}

const FindInventoryHelper = async ({ inventoryId, productId }) => {
  const product = await Products.findById(productId)
  if (!product) {
    throw new NotFound(`PRODUCT NOT EXIST`)
  }

  const inventory = await Inventories.findOne({
    _id: inventoryId,
    product: productId
  }).lean()
  if (!inventory) {
    throw new NotFound(`INVENTORY NOT EXIST`)
  }

  return inventory
}

const CreateInventoryHelper = async ({ data, productId }) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const product = await Products.findOne({ _id: productId }).session(session)
    if (!product) {
      throw new NotFound(`PRODUCT NOT EXIST`)
    }

    const [inventory] = await Inventories.create(
      [
        {
          product: productId,
          quantity: data.quantity,
          remaining: data.quantity,
          receivedAt: data.receivedAt,
          expiredAt: (() => {
            const date = new Date(data.receivedAt)
            date.setFullYear(date.getFullYear() + 1)
            return date
          })()
        }
      ],
      { session }
    )

    product.inventories.push(inventory._id)
    await product.save({ session })
    await session.commitTransaction()

    return inventory
  } catch (error) {
    session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const UpdateInventoryHelper = async ({ data, inventoryId, productId }) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const product = await Products.findOne({ _id: productId }).session(session)
    if (!product) {
      throw new NotFound(`PRODUCT NOT EXIST`)
    }

    const existing = await Inventories.findOne({ _id: inventoryId }).session(session)
    if (!existing) {
      throw new NotFound(`INVENTORY NOT EXIST`)
    }

    const consumed = existing.quantity - existing.remaining
    const remaining = data.quantity - consumed
    if (remaining < 0) {
      throw new BadRequest(`REMAINING STOCK SHOULD NOT BE NEGATIVE NUMBER`)
    }

    const inventory = await Inventories.findOneAndUpdate(
      { _id: inventoryId },
      {
        quantity: data.quantity,
        remaining,
        receivedAt: data.receivedAt,
        expiredAt: (() => {
          const date = new Date(data.receivedAt)
          date.setFullYear(date.getFullYear() + 1)
          return date
        })()
      },
      { new: true, runValidators: true, session }
    )

    await inventory.save({ session })
    await session.commitTransaction()

    return inventory
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export { CreateInventoryHelper, FindInventoryHelper, GetInventoriesHelper, UpdateInventoryHelper }
