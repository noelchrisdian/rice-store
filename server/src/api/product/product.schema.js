import mongoose from 'mongoose'
import { z } from 'zod'

const ProductSchema = z
  .object({
    name: z.string().min(5, 'Product name must be at least 5 characters long'),
    price: z.coerce.number().positive('Price must be positive number'),
    description: z.string().optional(),
    unit: z.string().default('package').optional(),
    weightPerUnit: z.coerce
      .number()
      .int()
      .positive('Product package weight must be a positive number')
  })
  .strict()

export { ProductSchema }
