import mongoose from "mongoose";
import { NotFound } from "../errors/notFound.js";
import { productModel as Products } from "../api/products/model.js";
import { reviewModel as Reviews } from '../api/reviews/model.js';

const getProducts = async () => {
    return await Products.find()
        .select('name price image description inventories weightPerUnit')
        .populate('inventories', 'remaining')
        .sort({ name: 1 })
}

const getProduct = async (req) => {
    const { id } = req.params;
    const product = await Products.findById(id).select('name price image description').lean();
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    return product;
}

const getIndexReviews = async () => {
    return await Reviews.find({ rating: 5 })
        .select('user rating comment')
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name')
        .lean()
}

const getReviews = async (req) => {
    const { id } = req.params;
    const product = await Products.findById(id).lean();
    if (!product) {
        throw new NotFound(`Product doesn't exist`);
    }

    const [reviews, statistic] = await Promise.all([
        Reviews.find({ product: id })
            .select('user rating comment createdAt')
            .limit(5)
            .sort({ createdAt: -1 })
            .populate('user', 'name avatar')
            .lean(),
        Reviews.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    average: { $avg: '$rating' },
                    total: { $sum: 1 },
                    star5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                    star4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                    star3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                    star2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                    star1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
                }
            }
        ])
    ])

    const analytics = statistic.length > 0 ? {
        average: statistic[0].average.toFixed(1),
        total: statistic[0].total,
        star5: statistic[0].star5,
        star4: statistic[0].star4,
        star3: statistic[0].star3,
        star2: statistic[0].star2,
        star1: statistic[0].star1
    } : {
        average: 0,
        total: 0,
        star5: 0,
        star4: 0,
        star3: 0,
        star2: 0,
        star1: 0
    }

    return {
        reviews,
        analytics
    }
}

export {
    getIndexReviews,
    getProduct,
    getProducts,
    getReviews
}