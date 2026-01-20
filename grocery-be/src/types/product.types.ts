// ============================================
// PRODUCT TYPES - Định nghĩa kiểu dữ liệu cho sản phẩm
// ============================================

/**
 * Interface chính cho Product document trong MongoDB
 * Mô tả đầy đủ cấu trúc của một sản phẩm
 */

import { Model } from "mongoose"
import { ProductUnit } from "./common.types"

export interface IProduct {
   _id: string // MongoDB ObjectId (dạng string)
   name: string // Tên sản phẩm
   description: string // Mô tả chi tiết
   price: number // Giá (VNĐ)
   category: string // ID của category
   stock: number // Số lượng tồn kho
   imageUrl?: string // URL hình ảnh (optional - có thể có hoặc không)
   isActive: boolean // Trạng thái hoạt động
   createdAt: Date // Ngày tạo
   updatedAt: Date // Ngày cập nhật
   unit: ProductUnit
   averageRating?: number    // TODO: Thêm field này
   numReviews?: number       // TODO: Thêm field này
   sku?: string              // SKU (Stock Keeping Unit) - Mã sản phẩm tự động
   isLowStock(): boolean   // Instance methods
   discountedPrice: number // Virtual field
   imagePublicId?: string
}

/**
 * Type cho việc TẠO sản phẩm mới
 * Loại bỏ các field tự động generate (_id, createdAt, updatedAt)
 */
export type IProductInput = Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>

/**
 * Type cho việc CẬP NHẬT sản phẩm
 * Tất cả các field đều optional (có thể update một phần)
 */
export type IProductUpdate = Partial<IProductInput>

/**
 * Type cho query parameters khi lấy danh sách sản phẩm
 */
export interface IProductQuery {
   page?: number // Trang hiện tại (mặc định: 1)
   limit?: number // Số sản phẩm mỗi trang (mặc định: 10)
   category?: string // Lọc theo category
   minPrice?: number // Giá tối thiểu
   maxPrice?: number // Giá tối đa
   search?: string // Tìm kiếm theo tên
   isActive?: boolean // Lọc theo trạng thái
}

/**
 * Type cho response khi lấy danh sách sản phẩm (có phân trang)
 */
export interface IProductListResponse {
   products: IProduct[] // Mảng sản phẩm
   pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
   }
}

// Filters cho getAllProducts
export interface ProductFilters {
   page?: number
   limit?: number
   category?: string
   stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock'
   search?: string
}

export interface IProductModel extends Model<IProduct> {
   findLowStock(): Promise<IProduct[]>

   findByCategory(categoryId: string): Promise<IProduct[]>
}
