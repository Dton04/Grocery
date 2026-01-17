import { Request, Response } from 'express'
import { Category } from '../models/Category'
import { ICategoryInput, ICategoryUpdate } from '../types/category.types'
import { asyncHandler } from '../utils/asyncHandler'
import { AppError } from '../utils/AppError'
import { NotFoundError, ValidationError } from '../utils/customErrors'

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Success
 */
export const getAllCategories = asyncHandler(async (req, res) => {
   // Query parameters
   const page = parseInt(req.query.page as string) || 1
   const limit = parseInt(req.query.limit as string) || 10
   const skip = (page - 1) * limit

   // Lấy danh mục với phân trang
   const categories = await Category.find({ isActive: true })
      .limit(limit)
      .skip(skip)
      .sort({ name: 1 }) // Sắp xếp A-Z

   // Đếm tổng số danh mục
   const total = await Category.countDocuments({ isActive: true })

   res.status(200).json({
      success: true,
      data: {
         categories,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
         },
      },
   })
})

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
export const getCategoryById = asyncHandler(async (req, res) => {
   const { id } = req.params
   const category = await Category.findById(id)

   if (!category) {
      throw new NotFoundError('Không tìm thấy danh mục')
   }

   res.status(200).json({
      success: true,
      data: category,
   })
})

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Success
 */

export const createCategory = asyncHandler(async (req, res) => {
   const categoryData: ICategoryInput = req.body

   if (!categoryData.name) {
      throw new ValidationError('Tên danh mục không được để trống')
   }
   // Tạo danh mục mới
   const category = await Category.create(categoryData)

   res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category,
   })
})

/**
 * @desc    Cập nhật danh mục
 * @route   PUT /api/category/:id
 * @access  Private (Admin)
 */
export const updateCategory = asyncHandler(async (req, res) => {
   const { id } = req.params
   const updateData: ICategoryUpdate = req.body

   const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
   })

   if (!category) {
      throw new NotFoundError('Không tìm thấy danh mục')
   }

   res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category,
   })
})

/**
 * @desc    Xóa danh mục (soft delete)
 * @route   DELETE /api/category/:id
 * @access  Private (Admin)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
   const { id } = req.params

   // Soft delete - chỉ set isActive = false
   const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
   )

   if (!category) {
      throw new NotFoundError('Không tìm thấy danh mục')
   }

   res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công',
      data: category,
   })
})