import { Request, Response } from 'express'
import { ICategoryInput, ICategoryUpdate } from '../types/category.types'
import { asyncHandler } from '../utils/asyncHandler'
import { ValidationError } from '../utils/customErrors'
import { CategoryService } from '../services/categoryService'

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Lấy danh sách danh mục
 *     description: Lấy tất cả danh mục với filter và pagination
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng items mỗi trang
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Lọc theo trạng thái hoạt động
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên danh mục
 *         example: "Gạo"
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
export const getAllCategories = asyncHandler(async (req, res) => {
   const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      isActive: req.query.isActive === 'false' ? false : true,
      search: req.query.search as string
   }

   const result = await CategoryService.getAllCategories(filters)

   res.status(200).json({
      success: true,
      data: result,
   })
})

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục
 *     description: Lấy thông tin chi tiết của một danh mục theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Lấy danh mục thành công
 *       404:
 *         description: Không tìm thấy danh mục
 */
export const getCategoryById = asyncHandler(async (req, res) => {
   const { id } = req.params

   const category = await CategoryService.getCategoryById(id as string)

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
 *     description: Tạo một danh mục sản phẩm mới
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gạo"
 *                 description: Tên danh mục
 *               description:
 *                 type: string
 *                 example: "Danh mục các loại gạo"
 *                 description: Mô tả danh mục
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *                 description: URL hình ảnh danh mục
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Trạng thái hoạt động
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

export const createCategory = asyncHandler(async (req, res) => {
   const categoryData: ICategoryInput = req.body

   if (!categoryData.name || !categoryData.description) {
      throw new ValidationError('Tên và mô tả danh mục là bắt buộc')
   }

   const category = await CategoryService.createCategory(categoryData)

   res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category,
   })
})

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     description: Cập nhật thông tin danh mục
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gạo ST25"
 *               description:
 *                 type: string
 *                 example: "Danh mục gạo cao cấp"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Chỉ admin mới có quyền
 */
export const updateCategory = asyncHandler(async (req, res) => {
   const { id } = req.params
   const updateData: ICategoryUpdate = req.body

   const category = await CategoryService.updateCategory(id as string, updateData)

   res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category,
   })
})

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Xóa danh mục (soft delete)
 *     description: Đánh dấu danh mục là không hoạt động (isActive = false)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Chỉ admin mới có quyền
 */
export const deleteCategory = asyncHandler(async (req, res) => {
   const { id } = req.params

   await CategoryService.deleteCategory(id as string)

   res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công',
   })
})
