import mongoose, { model, Schema } from 'mongoose';

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true })

const cartModel = model('Cart', cartSchema);

export {
    cartModel
}