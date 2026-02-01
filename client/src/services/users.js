import z from 'zod';
import { privateAPI } from "../utils/axios";

const changeProfileSchema = z.object({
    name: z.string().min(5, 'Nama minimal 5 karakter'),
    phoneNumber: z.e164('Nomor handphone tidak valid'),
    email: z.string().email(),
    password: z.string().min(5, 'Kata sandi minimal 5 karakter').optional(),
    confirmPassword: z.string().min(5, 'Kata sandi minimal 5 karakter').optional(),
    address: z.string().min(5, 'Alamat minimal 5 karakter')
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Kata sandi wajib sama'
})

const getUsers = async ({ limit, page, search }) => {
    const response = await privateAPI.get('/admin/users/', {
        params: { limit, page, search }
    })
    return response.data;
}

const getAdmin = async () => {
    const response = await privateAPI.get(`/admin/user`);
    return response.data;
}

const getCustomer = async () => {
    const response = await privateAPI.get('/customers/user');
    return response.data;
}

const updateUser = async (data) => {
    const response = await privateAPI.put('/change-profile', data);
    return response.data;
}

export {
    changeProfileSchema,
    getAdmin,
    getCustomer,
    getUsers,
    updateUser
}