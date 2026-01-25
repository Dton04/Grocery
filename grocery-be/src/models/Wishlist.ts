import mongoose, { Schema } from 'mongoose'
import { IWishlist, IWishlistItem } from '../types/wishlist.types'

const wishlistItemSchema = new Schema<IWishlistItem>({
   product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
   },
   addedAt: {
      type: Date,
      default: Date.now
   }
}, { _id: false })
// Schema cho Wishlist
const wishlistSchema = new Schema<IWishlist>({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
   },
   items: [wishlistItemSchema]
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
})
// Virtual: Số lượng items
wishlistSchema.virtual('itemCount').get(function () {
   return this.items.length
})
// Index để tìm nhanh
wishlistSchema.index({ user: 1 })
export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema)