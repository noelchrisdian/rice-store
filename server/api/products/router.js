import { upload } from '../../utils/multer.js';
import {
    create,
    find,
    index,
    remove,
    update
} from './controller.js';
import { router as inventoryRouter } from '../inventories/router.js';
import { Router } from 'express';

const router = Router();

router
    .get('/', index)
    .post('/', upload.single('image'), create)
    .get('/:id', find)
    .put('/:id', upload.single('image'), update)
    .delete('/:id', remove)
    .use('/', inventoryRouter)

export {
    router
}