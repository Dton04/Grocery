import mongoose, { Schema, Model } from 'mongoose'
import { IProduct, IProductModel } from '../types/product.types'

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
         default: ''
      },
      imagePublicId: {
         type: String,
         default: ''
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
      },
      sku: {
         type: String,
         unique: true,
         sparse: true, // Cho phép nhiều document không có SKU
      }
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
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

productSchema.virtual('fullInfo').get(function () {
   return `Tên: ${this.name} - Giá: ${this.price} VNĐ - Tồn kho: ${this.stock}`
})


/**
 * MONGOOSE HOOKS
 */

/**
 * Bài 1: Pre-save Hook - Auto Uppercase Product Name
 * Chạy TRƯỚC khi save document vào database
 */
productSchema.pre('save', function (next) {
   // TODO: Uppercase tên sản phẩm
   // Hint: this.name = this.name.toUpperCase()
   if (this.isModified('name')) {
      this.name = this.name.toUpperCase()
   }
})

/**
 * Bài 2: Pre-save Hook - Auto Generate SKU
 * Generate SKU nếu chưa có
 */
productSchema.pre('save', function () {
   // Check: Có SKU chưa?
   if (!this.sku) {
      // Generate SKU = PRD-{timestamp}
      this.sku = `PRD-${Date.now()}`
   }
})

/**
 * Bài 3: Post-save Hook - Log Activity
 * TODO: Log product name sau khi save
 */

productSchema.post('save', function (doc) {
   console.log(`Product saved: ${doc.name}`)
})

/**
 * Bài 4: Pre-update Hook - Validate Stock
 * TODO: Validate stock không được < 0
 */
productSchema.pre('findOneAndUpdate', function (next) {
   const update = this.getUpdate() as any
   if (update.stock !== undefined && update.stock < 0) {
      throw new Error('Stock không được âm nhé')
   }
   next()
})

/**
 * Bài 5: Virtual Field - Discount Price
 * TODO: Tạo virtual field discountedPrice
 */
productSchema.virtual('discountedPrice').get(function () {
   return this.price * 0.9
})

/**
 * Bài 6: Instance Method - isLowStock()
 * TODO: Return true nếu stock < 20
 */
productSchema.methods.isLowStock = function () {
   return this.stock < 20
}

/**
 * Bài 7: Static Method - findLowStock()
 * TODO: Find all products với stock < 20
 */
productSchema.statics.findLowStock = function () {
   return this.find({ stock: { $lt: 20 } })
}
/**
 * Export Model với type IProduct
 */
export const Product = mongoose.model<IProduct, IProductModel>('Product', productSchema)
