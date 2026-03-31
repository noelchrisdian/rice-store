import { model, Schema } from "mongoose";

const webhookSchema = new Schema({
    transaction_id: {
        type: String,
        required: true,
        unique: true
    },
    order_id: String,
    status: String
}, { timestamps: true })

const webhookModel = model('Webhook', webhookSchema);

export {
    webhookModel
}