import {
  CreateInventory,
  FindInventory,
  GetInventories,
  UpdateInventory
} from './inventory.controller.js'
import { Router } from 'express'

const router = Router()

router
  .get('/:productId/inventories', GetInventories)
  .post('/:productId/inventories', CreateInventory)
  .get('/:productID/inventories/:inventoryId', FindInventory)
  .put('/:productID/inventories/:inventoryId', UpdateInventory)

export { router }
