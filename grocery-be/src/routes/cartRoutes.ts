import express from 'express'
import { addToCart, removeFromCart, getCart, updateCartItem, clearCart } from '../controllers/cartController'
import { protect } from '../middleware/auth'
const router = express.Router()

// Thêm sản phẩm vào giỏ hàng
router.post('/', protect, addToCart)
router.get('/', protect, getCart)
router.put('/', protect, updateCartItem)

router.delete('/clear', protect, clearCart)

router.delete('/:productId', protect, removeFromCart)


export default router