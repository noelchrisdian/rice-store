import { createReview } from "../../services/reviews.js";
import { StatusCodes } from "http-status-codes";
import { success } from '../../utils/response.js';

const create = async (req, res, next) => {
    try {
        const review = await createReview(req);
        success(res, review, 'Review has been created', StatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

export {
    create
}