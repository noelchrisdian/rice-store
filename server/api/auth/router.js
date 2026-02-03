import { authenticated } from '../../middlewares/auth.js';
import {
    login,
    register,
    update
} from "./controller.js";
import { rateLimit } from 'express-rate-limit';
import { Router } from "express";
import { upload } from "../../utils/multer.js";

const router = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    statusCode: 429,
    message: {
        data: null,
        status: 'failed',
        message: 'Terlalu banyak request, silakan coba lagi nanti'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 64
})

router
    .post('/sign-in', limiter, login)
    .post('/sign-up', limiter, upload.single('image'), register)
    .put('/change-profile', authenticated, upload.single('image'), update)

export {
    router
}