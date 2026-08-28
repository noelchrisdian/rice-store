import { z } from 'zod'

const ReviewSchema = z
  .object({
    rating: z.coerce.number().int('Rating must be an integer').min(1).max(5),
    comment: z.string()
  })
  .strict()

export {
    ReviewSchema
}