import mongoose, { model, Schema } from "mongoose";

const resetPasswordSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {
            expires: 0
        }
    }
})

const resetPasswordModel = model('resetPassword', resetPasswordSchema);

export {
    resetPasswordModel
}