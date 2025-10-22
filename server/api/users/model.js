import { compare, genSalt, hash } from 'bcrypt';
import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    avatar: {
        imageURL: {
            type: String
        },
        imagePublicID: {
            type: String
        }
    }, 
    address: {
        type: String,
        required: true
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next;
    
    const salt = await genSalt(12);
    this.password = await hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (inputPassword) {
    return await compare(inputPassword, this.password);
}

const userModel = model('User', userSchema);

export {
    userModel
}