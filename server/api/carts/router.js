import {
    create,
    index,
    update
} from "./controller.js";
import { Router } from "express";

const router = Router();

router
    .get('/', index)
    .post('/', create)
    .patch('/', update)

export {
    router
}