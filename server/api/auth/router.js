import { authenticated } from '../../middlewares/auth.js';
import {
    change,
    findToken,
    login,
    register,
    reset,
    update
} from "./controller.js";
import { Router } from "express";
import { upload } from "../../utils/multer.js";

const router = Router();

router
    .get('/get-reset-token', findToken)
    .post('/sign-in', login)
    .post('/sign-up', upload.single('image'), register)
    .post('/reset-password', reset)
    .post('/change-password', change)
    .put('/change-profile', authenticated, upload.single('image'), update)

export {
    router
}