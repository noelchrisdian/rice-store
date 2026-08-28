import { z } from 'zod'

const IdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/)
})

export {
    IdSchema
}