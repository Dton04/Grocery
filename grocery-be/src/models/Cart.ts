import { Schema, model } from 'mongoose'
import { ICart, ICartItem } from '../types/cart.types'

const cartItemSchema = new Schema<ICartItem>({
   product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
   },
   quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng phải từ 1']
   },
   price: {
      type: Number,
      required: true
   }
}, { _id: false })

const cartSchema = new Schema<ICart>({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
   },
   items: [cartItemSchema]
}, {
   timestamps: true,
   toJSON: { virtuals: true }
})
cartSchema.virtual('totalPrice').get(function () {
   return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
   }, 0)
})

export const Cart = model<ICart>('Cart', cartSchema)