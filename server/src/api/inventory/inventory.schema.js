import { z } from 'zod'

const InventorySchema = z
  .object({
    quantity: z.coerce.number().positive('Quantity must be positive number'),
    receivedAt: z.coerce.date()
  })
  .strict()

export { InventorySchema }
