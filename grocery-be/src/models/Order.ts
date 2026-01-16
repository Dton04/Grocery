import mongoose, { Schema, Model } from 'mongoose'
import { IOrder, IOrderStatics } from '../types/order.types'
// Schema cho OrderItem (nested)
const orderItemSchema = new Schema({
   product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',  // ← Ref đến Product model
      required: true
   },
   quantity: { type: Number, required: true, min: 1 },
   price: { type: Number, required: true },
   unit: { type: String, required: true }
}, { _id: false })  // ← Không tạo _id cho sub-document

type OrderModel = Model<IOrder, {}, {}, {}, any, IOrderStatics>
// Schema cho Order

const orderSchema = new Schema<IOrder, OrderModel>(
   {
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User',  // ← Ref đến User model
         required: true
      },
      items: [orderItemSchema],  // ← Array of OrderItem
      totalAmount: { type: Number, default: 0 },
      status: {
         type: String,
         enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
         default: 'pending'
      },
      shippingAddress: { type: String, required: true },
      note: { type: String }
   },
   { timestamps: true }
)

// Pre-save: Tính totalAmount tự động
orderSchema.pre('save', function () {
   this.totalAmount = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
   }, 0)
})
// Static method: Lấy orders của user
orderSchema.statics.findByUser = function (userId: string) {
   return this.find({ user: userId })
      .populate('user', 'fullName email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
}

export const Order = mongoose.model<IOrder, OrderModel>('Order', orderSchema)
