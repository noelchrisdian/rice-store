import mongoose, { model, Schema } from 'mongoose';

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
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
    reservedStock: [{
        inventory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }], 
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
        index: true
    },
    payment: {
        method: {
            type: String,
            enum: ['midtrans', 'cash'],
            default: 'midtrans'
        },
        status: {
            type: String,
            enum: ['pending', 'settlement', 'deny', 'cancel', 'expire', 'failure', 'refund', 'partial_refund', 'capture'],
            default: 'pending'
        },
        paidAt: Date,
        expiry_time: Date,
        midtransOrderID: String,
        midtransTransactionID: String
    }
}, { timestamps: true })

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const orderModel = model('Order', orderSchema);

export {
    orderModel
}