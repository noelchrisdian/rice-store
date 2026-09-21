import mongoose, { model, Schema, Types } from 'mongoose'

interface CartInterface {
  user: Types.ObjectId
  products: {
    product: Types.ObjectId
    quantity: number
    addedAt: Date
  }[]
}

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
)

const CartModel = model<CartInterface>('Cart', cartSchema)

export type { CartInterface }
export { CartModel }
