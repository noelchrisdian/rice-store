import { model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
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
  },
  { timestamps: true }
)

const UserModel = model('User', userSchema)

export { UserModel }
