import { z } from 'zod';

const productSchema = z.object({
    name: z.string().min(5, 'Product name must be at least 5 characters long'),
    price: z.coerce.number().positive('Price must be positive number'),
    description: z.string().optional(),
    unit: z.string().default('kg').optional()
}).strict();

const inventorySchema = z.object({
    quantity: z.coerce.number().positive('Quantity must be positive number'),
    receivedAt: z.coerce.date()
}).strict();

const userSchema = z.object({
    name: z.string().min(5, 'Name must be at least 5 characters long'),
    phoneNumber: z.e164(),
    email: z.string().email(),
    password: z.string().min(5, 'Password must be at least 5 characters long'),
    role: z.enum(['admin', 'customer']),
    address: z.string()
}).strict();

export {
    productSchema,
    inventorySchema,
    userSchema
}