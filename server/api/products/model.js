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
        default: 'kg'
    },
    inventories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory'
    }]
}, { timestamps: true })

const productModel = model('Product', productSchema);

export {
    productModel
}