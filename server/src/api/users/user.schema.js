import { z } from 'zod'

const emailSchema = z.email()
const phoneNumberSchema = z.e164()
const passwordSchema = z.string().min(5, 'Password must be at least 5 characters long')
const confirmPasswordSchema = z.string().min(5, 'Password must be at least 5 characters long')

const UserSchema = z
  .object({
    name: z.string().min(5, 'Name must be at least 5 characters long'),
    phoneNumber: phoneNumberSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    address: z.string().min(5, 'Address must be at least 5 characters long')
  })
  .strict()

const SignInSchema = z
  .object({
    phoneNumber: phoneNumberSchema,
    password: passwordSchema
  })
  .strict()

export { UserSchema, SignInSchema }
