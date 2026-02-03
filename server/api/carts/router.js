import {
    create,
    index,
    update
} from "./controller.js";
import { rateLimit } from 'express-rate-limit';
import { Router } from "express";

const router = Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
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
    .get('/', index)
    .post('/', create)
    .patch('/', limiter, update)

export {
    router
}