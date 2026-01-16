// ============================================
// CATEGORY TYPES - Định nghĩa kiểu dữ liệu cho danh mục sản phẩm
// ============================================

/**
 * Interface chính cho Category document trong MongoDB
 */
export interface ICategory {
   _id: string // MongoDB ObjectId
   name: string // Tên danh mục (VD: "Gạo", "Dầu ăn", "Gia vị")
   description: string // Mô tả danh mục
   imageUrl?: string // URL hình ảnh (optional)
   isActive: boolean // Trạng thái hoạt động
   createdAt: Date // Ngày tạo
   updatedAt: Date // Ngày cập nhật
}

/**
 * Type cho việc TẠO category mới
 */
export type ICategoryInput = Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>

/**
 * Type cho việc CẬP NHẬT category
 */
export type ICategoryUpdate = Partial<ICategoryInput>
