import mongoose, { model, Schema } from "mongoose";

const inventorySchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
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
    },
    status: {
        type: String,
        enum: ['available', 'depleted', 'expired'],
        default: 'available',
        required: true
    }
}, { timestamps: true })

inventorySchema.pre('save', function (next) {
    if (this.remaining === 0) {
        this.status = 'depleted';
    } else if (Date.now() > this.expiredAt) {
        this.status = 'expired';
    } else {
        this.status = 'available';
    }

    next();
})

const inventoryModel = model('Inventory', inventorySchema);

export {
    inventoryModel
}