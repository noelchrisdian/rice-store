import { StatusCodes } from 'http-status-codes'

import {
  CreateProductHelper,
  DeleteProductHelper,
  FindProductHelper,
  GetProductsHelper,
  UpdateProductHelper
} from './product.helper.js'
import { IdSchema } from '../../shared/utils/id_schema.utils.js'
import { ProductSchema } from './product.schema.js'
import { SendSuccess } from '../../shared/utils/response.utils.js'
import { ValidationInput } from '../../shared/utils/input_validation.utils.js'

const GetProducts = async (req, res, next) => {
  try {
    const products = await GetProductsHelper()
    SendSuccess(res, products, 'Products fetched successfully')
  } catch (error) {
    next(error)
  }
}

const FindProduct = async (req, res, next) => {
  try {
    const { id } = await ValidationInput(IdSchema, req.params)
    const product = await FindProductHelper(id)
    SendSuccess(res, product, `${product.name} fetched successfully`)
  } catch (error) {
    next(error)
  }
}

const CreateProduct = async (req, res, next) => {
  try {
    const data = await ValidationInput(ProductSchema, req.body)
    const product = await CreateProductHelper({
      data,
      file: req.file
    })
    SendSuccess(res, product, `${product.name} has been created`, StatusCodes.CREATED)
  } catch (error) {
    next(error)
  }
}

const UpdateProduct = async (req, res, next) => {
  try {
    const { id } = await ValidationInput(IdSchema, req.params)
    const data = await ValidationInput(ProductSchema, req.body)
    const product = await UpdateProductHelper({
      id,
      file: req.file,
      data
    })
    SendSuccess(res, product, `${product.name} has been updated`)
  } catch (error) {
    next(error)
  }
}

const DeleteProduct = async (req, res, next) => {
  try {
    const { id } = await ValidationInput(IdSchema, req.params)
    const product = await DeleteProductHelper(id)
    SendSuccess(res, product, `${product.name} has been deleted`)
  } catch (error) {
    next(error)
  }
}

export { CreateProduct, DeleteProduct, FindProduct, GetProducts, UpdateProduct }
