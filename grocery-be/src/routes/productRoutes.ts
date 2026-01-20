import express from 'express'
import {
   getAllProducts,
   getProductById,
   createProduct,
   updateProduct,
   deleteProduct,
   checkLowStock,
   getLowStockProducts,
   uploadProductImage
} from '../controllers/productController'
import { protect } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import { validate, validateQuery } from '../middleware/validate'
import { createProductSchema, updateProductSchema, getProductsQuerySchema } from '../validators/productValidator'
import { upload } from '../middleware/upload'

const router = express.Router()

/**
 * @route   GET /api/products
 * @desc    Lấy tất cả sản phẩm (có phân trang)
 * @access  Public
 */
router.get('/', validateQuery(getProductsQuerySchema), getAllProducts)

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
router.post('/', protect,
   authorize('admin'),
   validate(createProductSchema),
   createProduct)

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật sản phẩm
 * @access  Private (Admin)
 */
router.put('/:id', protect,
   authorize('admin'),
   validate(updateProductSchema),
   updateProduct)

/**
 * @route   DELETE /api/products/:id
 * @desc    Xóa sản phẩm (soft delete)
 * @access  Private (Admin)
 */
router.delete('/:id', protect,
   authorize('admin'),
   deleteProduct)

router.get('/:id/check-stock', checkLowStock)

/**
 * @route   PUT /api/products/:id/image
 * @desc    Upload product image
 * @access  Private (Admin)
 */
router.put('/:id/image',
   protect,
   authorize('admin'),
   upload.single('image'),
   uploadProductImage
)


export default router
