import express from 'express'
import {
   getAllCategories,
   getCategoryById,
   createCategory,
   updateCategory,
   deleteCategory,
} from '../controllers/categoryController'

const router = express.Router()

/**
 * @route   GET /api/category
 * @desc    Lấy tất cả category (có phân trang)
 * @access  Public
 */
router.get('/', getAllCategories)

/**
 * @route   GET /api/category/:id
 * @desc    Lấy category theo ID
 * @access  Public
 */
router.get('/:id', getCategoryById)

/**
 * @route   POST /api/category
 * @desc    Tạo category mới
 * @access  Private (Admin)
 */
router.post('/', createCategory)

/**
 * @route   PUT /api/category/:id
 * @desc    Cập nhật category
 * @access  Private (Admin)
 */
router.put('/:id', updateCategory)

/**
 * @route   DELETE /api/category/:id
 * @desc    Xóa category(soft delete)
 * @access  Private (Admin)
 */
router.delete('/:id', deleteCategory)

export default router
