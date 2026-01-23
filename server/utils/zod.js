import { z } from 'zod';

const productSchema = z.object({
    name: z.string().min(5, 'Product name must be at least 5 characters long'),
    price: z.coerce.number().positive('Price must be positive number'),
    description: z.string().optional(),
    unit: z.string().default('package').optional(),
    weightPerUnit: z.coerce.number().int().positive('Product package weight must be a positive number')
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
    confirmPassword: z.string().min(5, 'Password must be at least 5 characters long'),
    address: z.string().min(5, 'Address must be at least 5 characters long')
}).strict();

const emailSchema = userSchema.omit({ name: true, phoneNumber: true, password: true, confirmPassword: true, address: true });

const passwordSchema = z.object({
    password: z.string().min(5, 'Kata sandi minimal 5 karakter'),
    confirmPassword: z.string().min(5, 'Kata sandi minimal 5 karakter')
}).strict();

const cartSchema = z.object({
    products: z.array(z.object({
        product: z.string(),
        quantity: z.coerce.number().int().nonnegative('Quantity must be a positive number')
    })).min(1, 'At least one product is required')
})

const reviewSchema = z.object({
    rating: z.coerce.number().int('Rating must be an integer').min(1).max(5),
    comment: z.string()
}).strict();

export {
    cartSchema,
    inventorySchema,
    passwordSchema,
    emailSchema,
    productSchema,
    reviewSchema,
    userSchema
}