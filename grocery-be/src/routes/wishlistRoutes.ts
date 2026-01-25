import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist, clearWishlist, addToCartFromWishlist } from "../controllers/wishlistController";
import { protect } from "../middleware/auth";
const router = Router()

router.post('/', protect, addToWishlist)
router.get('/', protect, getWishlist)
router.delete('/', protect, clearWishlist)
router.delete('/:productId', protect, removeFromWishlist)
router.post('/add-to-cart/:productId', protect, addToCartFromWishlist)

export default router