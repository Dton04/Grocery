import express from 'express'
import {
   getAllProducts,
   getProductById,
   createProduct,
   updateProduct,
   deleteProduct,
   checkLowStock,
   getLowStockProducts,
} from '../controllers/productController'
import { protect } from '../middleware/auth'
import { authorize } from '../middleware/authorize'

const router = express.Router()

/**
 * @route   GET /api/products
 * @desc    Lấy tất cả sản phẩm (có phân trang)
 * @access  Public
 */
router.get('/', getAllProducts)

router.get('/low-stock', getLowStockProducts)
/**
 * @route   GET /api/products/:id
 * @desc    Lấy sản phẩm theo ID
 * @access  Public
 */
router.get('/:id', protect, getProductById)

/**
 * @route   POST /api/products
 * @desc    Tạo sản phẩm mới
 * @access  Private (Admin)
 */
router.post('/', protect, authorize('admin'), createProduct)

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật sản phẩm
 * @access  Private (Admin)
 */
router.put('/:id', protect, authorize('admin'), updateProduct)

/**
 * @route   DELETE /api/products/:id
 * @desc    Xóa sản phẩm (soft delete)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, authorize('admin'), deleteProduct)

router.get('/:id/check-stock', checkLowStock)


export default router
