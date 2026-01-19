import mongoose, { model, Schema } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    image: {
        imageURL: {
            type: String,
            required: true
        },
        imagePublicID: {
            type: String,
            required: true
        }
    },
    description: {
        type: String
    },
    unit: {
        type: String,
        default: 'package'
    },
    weightPerUnit: {
        type: Number,
        required: true,
        default: 5
    },
    inventories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

productSchema.virtual('stock').get(function () {
    if (!this.inventories || this.inventories.length === 0) return 0;
    const totalKg = this.inventories.reduce((acc, inv) => acc + inv.remaining, 0);

    return Math.floor(totalKg / this.weightPerUnit);
})

const productModel = model('Product', productSchema);

export {
    productModel
}