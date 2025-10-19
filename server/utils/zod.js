import { z } from 'zod';

const imageSchema = z.object({
    imageURL: z.string().url('Invalid image URL format'),
    imagePublicID: z.string().min(1, 'Image public ID is required')
})

const addProductSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(5, 'Product name must be at least 5 characters long'),
    price: z.coerce.number({ required_error: 'Price is required', invalid_type_error: 'Price must be a valid number' }).positive('Price must be positive number'),
    description: z.string().optional(),
    unit: z.string().default('kg').optional(),
    quantity: z.coerce.number({ required_error: 'Quantity is required', invalid_type_error: 'Quantity must be a valid number' }).positive('Quantity must be positive number'),
    receivedAt: z.coerce.date({ required_error: 'Received date is required', invalid_type_error: 'Received date must be a valid date format' }),
    image: imageSchema
})

const updateProductSchema = z.object({
    name: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    description: z.string().optional(),
    unit: z.string().default('kg').optional(),
    receivedAt: z.coerce.date().optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Please provide one field for update'
})

export {
    addProductSchema,
    updateProductSchema
}