import express from 'express'
import { addToCart, removeFromCart, getCart, updateCartItem, clearCart } from '../controllers/cartController'
import { protect } from '../middleware/auth'
import { validate, validateParams } from '../middleware/validate'
import { addToCartSchema, updateCartItemSchema, removeCartItemSchema } from '../validators/cartValidator'
const router = express.Router()


router.post('/', protect, validate(addToCartSchema), addToCart)
router.get('/', protect, getCart)
router.put('/', protect, validate(updateCartItemSchema), updateCartItem)

// clear giỏ hàng
router.delete('/clear', protect, clearCart)

// xóa sản phẩm khỏi giỏ hàng
router.delete('/:productId', protect, validateParams(removeCartItemSchema), removeFromCart)


export default router