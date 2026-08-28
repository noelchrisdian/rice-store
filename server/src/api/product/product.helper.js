import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

import { BadRequest } from '../../errors/badRequest.js'
import { cloudinaryUploader } from '../../shared/service/multer.service.js'
import { InventoryModel as Inventories } from '../inventory/inventory.model.js'
import { NotFound } from '../../shared/error/not_found.error.js'
import { ProductModel as Products } from './product.model.js'
import { ReviewModel as Reviews } from '../review/review.model.js'

const GetProductsHelper = async () => {
  return await Products.find().populate('inventories', 'remaining')
}

const FindProductHelper = async (id) => {
  const product = await Products.findById(id).populate({
    path: 'inventories',
    select: 'product quantity remaining receivedAt expiredAt'
  })

  if (!product) throw new NotFound('PRODUCT NOT FOUND')

  return product
}

const CreateProductHelper = async ({ data, file }) => {
  if (!file) throw new BadRequest('IMAGE IS REQUIRED')
  let uploadImage

  try {
    const check = await Products.findOne({ name: data.name })
    if (check) throw new BadRequest('PRODUCT EXISTED')

    uploadImage = await cloudinaryUploader(file.buffer, 'products')

    return await Products.create({
      name: data.name,
      price: data.price,
      image: {
        imageURL: uploadImage.secure_url,
        imagePublicID: uploadImage.public_id
      },
      description: data.description,
      unit: 'package',
      weightPerUnit: data.weightPerUnit,
      inventories: []
    })
  } catch (error) {
    if (uploadImage?.public_id) {
      await cloudinary.uploader.destroy(uploadImage.public_id)
    }
    throw error
  }
}

const UpdateProductHelper = async ({ id, file, data }) => {
  const product = await Products.findOne({ _id: id })
  if (!product) throw new NotFound(`PRODUCT NOT EXIST`)

  const check = await Products.findOne({ name: data.name, _id: { $ne: id } })
  if (check) throw new BadRequest('PRODUCT EXISTED')

  const updateData = { ...data }
  let uploadImage
  try {
    if (file) {
      uploadImage = await cloudinaryUploader(file.buffer, 'products')
      updateData.image = {
        imageURL: uploadImage.secure_url,
        imagePublicID: uploadImage.public_id
      }
    }

    const updated = await Products.findOneAndUpdate({ _id: id }, updateData, { new: true })

    if (file && product.image?.imagePublicID) {
      await cloudinary.uploader.destroy(product.image.imagePublicID)
    }

    return updated
  } catch (error) {
    if (uploadImage?.public_id) {
      await cloudinary.uploader.destroy(uploadImage.public_id)
    }
    throw error
  }
}

const DeleteProductHelper = async (id) => {
  let product
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    product = await Products.findOneAndDelete({ _id: id }).session(session)
    if (!product) throw new NotFound(`PRODUCT NOT EXIST`)
    await Inventories.deleteMany({ product: product._id }).session(session)
    await Reviews.deleteMany({ product: product._id }).session(session)

    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }

  try {
    const imagePublicID = product.image.imagePublicID
    await cloudinary.uploader.destroy(imagePublicID)
  } catch (error) {
    console.error(`FAILED TO DELETE IMAGE : ${error}`)
  }

  return product
}

export {
  CreateProductHelper,
  DeleteProductHelper,
  FindProductHelper,
  GetProductsHelper,
  UpdateProductHelper
}
