import mongoose, { model, Schema } from "mongoose";

const inventorySchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true
    },
    remaining: {
        type: Number,
        required: true
    },
    receivedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiredAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const inventoryModel = model('Inventory', inventorySchema);

export {
    inventoryModel
}