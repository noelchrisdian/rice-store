import {
    create,
    find,
    index,
    update
} from './controller.js';
import { Router } from 'express';

const router = Router();

router
    .get('/:productID/inventories', index)
    .post('/:productID/inventories', create)
    .get('/:productID/inventories/:inventoryID', find)
    .put('/:productID/inventories/:inventoryID', update)

export {
    router
}