import { create, index } from "./controller.js";
import { Router } from "express";

const router = Router();

router
    .get('/', index)
    .post('/', create)

export {
    router
}