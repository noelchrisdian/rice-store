import mongoose, { model, Schema } from 'mongoose';

const orderSchema = new Schema({
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
        reviewed: {
            type: Boolean,
            default: false
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    payment: {
        status: {
            type: String,
            enum: ['pending', 'settlement', 'deny', 'cancel', 'expire', 'failure', 'refund', 'partial_refund', 'capture'],
            default: 'pending'
        },
        paidAt: Date
    }
}, { timestamps: true })

const orderModel = model('Order', orderSchema);

export {
    orderModel
}