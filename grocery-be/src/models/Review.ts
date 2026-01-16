import mongoose, { Schema, Model } from 'mongoose'
import { IReview } from '../types/review.types'
import { Product } from './Product'

const reviewSchema = new Schema<IReview>({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
   },
   rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
   },
   comment: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500
   }
}, { timestamps: true })

// Tạo index để user chỉ review 1 lần/product
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

// Static method: Tính average rating của product
reviewSchema.statics.calcAverageRating = async function (productId: string) {
   const stats = await this.aggregate([
      // Match reviews của product
      { $match: { product: new mongoose.Types.ObjectId(productId) } },

      // Group và tính average
      {
         $group: {
            _id: '$product',
            averageRating: { $avg: '$rating' },
            numReviews: { $sum: 1 }
         }
      }
   ])

   // Update product với average rating
   if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
         averageRating: Math.round(stats[0].averageRating * 10) / 10,
         numReviews: stats[0].numReviews
      })
   } else {
      await Product.findByIdAndUpdate(productId, {
         averageRating: 0,
         numReviews: 0
      })
   }
}

// Gọi calcAverageRating sau khi save
reviewSchema.post('save', function () {
   this.constructor.calcAverageRating(this.product)
})

// Gọi calcAverageRating sau khi delete
reviewSchema.post('remove', function () {
   this.constructor.calcAverageRating(this.product)
})

export const Review = mongoose.model<IReview>('Review', reviewSchema)