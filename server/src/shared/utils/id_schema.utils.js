import { z } from 'zod'

const IdSchema = z.object({
  id: z.string().refine(mongoose.isValidObjectId, 'INVALID PRODUCT ID')
})

export {
    IdSchema
}