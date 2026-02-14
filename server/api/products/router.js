import {
    create,
    find,
    index,
    remove as removeProduct,
    update
} from './controller.js';
import { indexReviews, removeReview } from '../admin/controller.js';
import { router as inventoryRouter } from '../inventories/router.js';
import { Router } from 'express';
import { upload } from '../../utils/multer.js';

const router = Router();

router
    .get('/', index)
    .post('/', upload.single('image'), create)
    .get('/:id', find)
    .get('/:id/reviews', indexReviews)
    .delete('/:id/reviews/:reviewID', removeReview)
    .put('/:id', upload.single('image'), update)
    .delete('/:id', removeProduct)
    .use('/', inventoryRouter)

export {
    router
}