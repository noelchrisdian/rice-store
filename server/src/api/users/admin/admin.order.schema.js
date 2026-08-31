import { z } from 'zod'

const OrderShippedSchema = z
  .object({
    courier: z.string(),
    fee: z.coerce.number().min(0, `Shipping fee couldn't be negative number`),
    trackingNumber: z.string().min(5, 'Tracking number must be at least 5 characters long'),
    shippedAt: z.coerce.date()
  })
  .strict()

const OrderDeliveredSchema = z
  .object({
    deliveredAt: z.coerce.date()
  })
  .strict()

export { OrderDeliveredSchema, OrderShippedSchema }
