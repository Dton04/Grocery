import mongoose, { Schema, Model } from 'mongoose'
import { IProduct } from '../types/product.types'

/**
 * Mongoose Schema cho Product
 * Generic <IProduct> giúp TypeScript biết cấu trúc document
 */
const productSchema = new Schema<IProduct>(
   {
      name: {
         type: String,
         required: [true, 'Tên sản phẩm là bắt buộc'],
         trim: true,
         maxlength: [100, 'Tên sản phẩm không được quá 100 ký tự'],
      },
      description: {
         type: String,
         required: [true, 'Mô tả sản phẩm là bắt buộc'],
         trim: true,
      },
      price: {
         type: Number,
         required: [true, 'Giá sản phẩm là bắt buộc'],
         min: [0, 'Giá không được âm'],
      },
      category: {
         type: String,
         required: [true, 'Danh mục là bắt buộc'],
         ref: 'Category', // Reference đến Category model
      },
      stock: {
         type: Number,
         required: [true, 'Số lượng tồn kho là bắt buộc'],
         min: [0, 'Số lượng không được âm'],
         default: 0,
      },
      imageUrl: {
         type: String,
         default: '',
      },
      unit: {
         type: String,
         required: [true, 'Đơn vị sản phẩm là bắt buộc'],
         enum: ['kg', 'gói', 'chai', 'lon', 'bịch', 'thùng', 'cái', 'bộ'],
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      averageRating: {
         type: Number,
         default: 0,
         min: 0,
         max: 5
      },
      numReviews: {
         type: Number,
         default: 0
      }
   },
   {
      timestamps: true, // Tự động thêm createdAt và updatedAt
   }
)

/**
 * Indexes để tối ưu query
 */
productSchema.index({ name: 'text' }) // Full-text search
productSchema.index({ category: 1, isActive: 1 }) // Compound index

/**
 * Virtual field - field không lưu trong DB
 */
productSchema.virtual('inStock').get(function () {
   return this.stock > 0
})

/**
 * Instance method - method cho từng document
 */
productSchema.methods.updateStock = function (quantity: number) {
   this.stock += quantity
   return this.save()
}

/**
 * Static method - method cho Model
 */
productSchema.statics.findByCategory = function (categoryId: string) {
   return this.find({ category: categoryId, isActive: true })
}

/**
 * Middleware - chạy trước khi save
 */
productSchema.pre('save', function () {
   // Tự động chuyển tên thành chữ hoa đầu câu
   if (this.isModified('name')) {
      this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1)
   }
})

productSchema.virtual('fullInfo').get(function () {
   return `Tên: ${this.name} - Giá: ${this.price} VNĐ - Tồn kho: ${this.stock}`
})


/**
 * Export Model với type IProduct
 */
export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema)
