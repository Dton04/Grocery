import mongoose, { Schema, Model } from "mongoose";
import { ICategory } from "../types/category.types";

const categorySchema = new Schema<ICategory>(
   {
      name: {
         type: String,
         required: [true, 'Tên danh mục là bắt buộc'],
         trim: true,
         maxlength: [100, 'Tên danh mục không được quá 100 ký tự'],
      },
      description: {
         type: String,
         required: [true, 'Mô tả danh mục là bắt buộc'],
         trim: true,
      },
      imageUrl: {
         type: String,
         default: ''
      },
      isActive: {
         type: Boolean,
         default: true
      }
   },
   {
      timestamps: true
   }
)

/**
 * Index để tối ưu query
 */
categorySchema.index({ name: 'text' }) // Full-text search

/**
 * Export Model với type ICategory
 */
export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema)