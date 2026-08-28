import { z } from 'zod'

const CartSchema = z.object({
  products: z
    .array(
      z.object({
        product: z.string(),
        quantity: z.coerce.number().int().nonnegative('Quantity must be a positive number')
      })
    )
    .min(1, 'At least one product is required')
})

export { CartSchema }
