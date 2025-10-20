import {
    create,
    index,
    update
} from './controller.js';
import { Router } from 'express';

const router = Router();

router
    .get('/:productID/inventories', index)
    .post('/:productID/inventories', create)
    .put('/:productID/inventories/:inventoryID', update)

export {
    router
}