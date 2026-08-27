import { StatusCodes } from 'http-status-codes'

import {
  CreateInventoryHelper,
  GetInventoriesHelper,
  FindInventoryHelper,
  UpdateInventoryHelper
} from './inventory.helper.js'
import { IdSchema } from '../../shared/utils/id_schema.utils.js'
import { InventorySchema } from './inventory.schema.js'
import { SendSuccess } from '../../shared/utils/response.utils.js'
import { ValidationInput } from '../../shared/utils/input_validation.utils.js'

const GetInventories = async (req, res, next) => {
  try {
    const { productId } = await ValidationInput(IdSchema, req.params)
    const inventories = await GetInventoriesHelper({
      productId,
      query: req.query
    })
    SendSuccess(res, inventories, `Inventories fetched successfully`)
  } catch (error) {
    next(error)
  }
}

const FindInventory = async (req, res, next) => {
  try {
    const { inventoryId, productId } = await ValidationInput(IdSchema, req.params)
    const inventory = await FindInventoryHelper({ inventoryId, productId })
    SendSuccess(res, inventory, `Inventory fetched successfully`)
  } catch (error) {
    next(error)
  }
}

const CreateInventory = async (req, res, next) => {
  try {
    const { productId } = await ValidationInput(IdSchema, req.params)
    const data = await ValidationInput(InventorySchema, req.body)
    const inventory = await CreateInventoryHelper({
      data,
      productId
    })
    SendSuccess(res, inventory, 'New inventory has been created', StatusCodes.CREATED)
  } catch (error) {
    next(error)
  }
}

const UpdateInventory = async (req, res, next) => {
  try {
    const { inventoryId, productId } = await ValidationInput(IdSchema, req.params)
    const data = await ValidationInput(InventorySchema, req.body)
    const inventory = await UpdateInventoryHelper({
      data,
      inventoryId,
      productId
    })
    SendSuccess(res, inventory, 'Inventory has been updated')
  } catch (error) {
    next(error)
  }
}

export { CreateInventory, FindInventory, GetInventories, UpdateInventory }
