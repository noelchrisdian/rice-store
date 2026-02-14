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
    payment: {
        method: {
            type: String,
            enum: ['midtrans'],
            default: 'midtrans'
        },
        status: {
            type: String,
            enum: ['pending', 'settlement', 'deny', 'cancel', 'expire', 'failure', 'capture'],
            default: 'pending'
        },
        paidAt: Date,
        expiry_time: Date,
        midtransOrderID: String,
        midtransTransactionID: String
    },
    shipping: {
        status: {
            type: String, 
            enum: ['processing', 'shipped', 'delivered', 'pending'],
            default: 'pending'
        },
        courier: String,
        trackingNumber: String,
        shippedAt: Date,
        deliveredAt: Date,
        proofImage: {
            imageURL: String,
            imagePublicID: String
        }
    }
}, { timestamps: true })

orderSchema
    .index({ user: 1, createdAt: -1 })
    .index({ 'payment.status': 1, createdAt: -1 })
    .index({ 'shipping.status': 1, createdAt: -1 })

const orderModel = model('Order', orderSchema);

export {
    orderModel
}