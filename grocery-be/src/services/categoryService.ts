import { Category } from "../models/Category"
import { ICategory, ICategoryInput, ICategoryUpdate } from "../types/category.types"
import { NotFoundError, ValidationError } from "../utils/customErrors"
export class CategoryService {

   // TODO: Implement getAllCategories
   // Input: filters (page, limit, isActive, search)
   // Output: { categories, pagination }
   // 
   // Các bước:
   // 1. Destructure filters với default values
   // 2. Build filter object
   // 3. Tính skip = (page - 1) * limit
   // 4. Query database với find(), skip(), limit(), sort()
   // 5. Count total documents
   // 6. Return { categories, pagination }

   static async getAllCategories(filters?: {
      isActive?: boolean
      search?: string
      page?: number
      limit?: number
   }): Promise<{
      categories: ICategory[]
      pagination: {
         page: number
         limit: number
         total: number
         totalPages: number
      }
   }> {
      const {
         page = 1,
         limit = 10,
         isActive,
         search
      } = filters || {}

      const skip = (page - 1) * limit

      const filter: any = { isActive: true }

      if (isActive !== undefined) {
         filter.isActive = isActive
      }

      if (search) {
         filter.name = { $regex: search, $options: 'i' }
      }

      const categories = await Category.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 })

      const total = await Category.countDocuments(filter)

      return {
         categories,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
         }
      }
   }

   static async getCategoryById(id: string): Promise<ICategory> {
      const category = await Category.findById(id)
      if (!category) {
         throw new NotFoundError('Category not found')
      }
      return category
   }

   static async createCategory(data: ICategoryInput): Promise<ICategory> {
      const checkCategory = await Category.findOne({ name: data.name })
      if (checkCategory) {
         throw new ValidationError('Đã tồn tại danh mục này')
      }
      const category = await Category.create(data)
      return category
   }

   static async updateCategory(id: string, data: ICategoryUpdate): Promise<ICategory> {
      if (data.name) {
         const checkCategory = await Category.findOne({
            name: data.name,
            _id: { $ne: id }
         })
         if (checkCategory) {
            throw new ValidationError('Đã tồn tại danh mục này')
         }
      }

      const category = await Category.findByIdAndUpdate(
         id,
         data,
         { new: true, runValidators: true })
      if (!category) {
         throw new NotFoundError('Danh mục không tồn tại')
      }

      return category
   }

   static async deleteCategory(id: string): Promise<ICategory> {
      const category = await Category.findByIdAndUpdate(
         id,
         { isActive: false },
         { new: true }
      )
      if (!category) {
         throw new NotFoundError('Danh mục không tồn tại')
      }
      return category
   }
}