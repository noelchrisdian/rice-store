import {
    create,
    find,
    index,
    remove,
    update
} from './controller.js';
import { indexReviews, updateReview } from '../admin/controller.js';
import { router as inventoryRouter } from '../inventories/router.js';
import { Router } from 'express';
import { upload } from '../../utils/multer.js';

const router = Router();

router
    .get('/', index)
    .post('/', upload.single('image'), create)
    .get('/:id', find)
    .get('/:id/reviews', indexReviews)
    .patch('/:id/reviews/:reviewID', updateReview)
    .put('/:id', upload.single('image'), update)
    .delete('/:id', remove)
    .use('/', inventoryRouter)

export {
    router
}