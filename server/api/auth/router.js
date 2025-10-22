import { Router } from "express";
import { login, register } from "./controller.js";
import { upload } from "../../utils/multer.js";

const router = Router();

router
    .post('/sign-in', login)
    .post('/sign-up', upload.single('image'), register)

export {
    router
}