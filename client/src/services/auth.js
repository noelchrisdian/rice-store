import z from 'zod';
import { api } from "../utils/axios";

const loginSchema = z.object({
    phoneNumber: z.e164('Nomor handphone tidak valid'),
    password: z.string().min(5, 'Kata sandi minimal 5 karakter')
})

const registerSchema = z.object({
    name: z.string().min(5, 'Nama minimal 5 karakter'),
    phoneNumber: z.e164('Nomor handphone tidak valid'),
    email: z.email('Alamat email tidak valid'),
    password: z.string().min(5, 'Kata sandi minimal 5 karakter'),
    confirmPassword: z.string().min(5, 'Kata sandi minimal 5 karakter'),
    address: z.string().min(5, 'Alamat minimal 5 karakter')
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Kata sandi wajib sama'
})

const login = async (data) => {
    const response = await api.post('/sign-in', data);
    return response.data;
}

const register = async (data) => {
    const response = await api.post('/sign-up', data);
    return response.data;
}

const reset = async (data) => {
    const response = await api.post('/reset-password', data)
    return response.data;
}

export {
    login,
    loginSchema,
    register,
    registerSchema,
    reset
}