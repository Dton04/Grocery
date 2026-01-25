import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist, clearWishlist, addToCartFromWishlist } from "../controllers/wishlistController";
import { protect } from "../middleware/auth";
import { validate, validateParams } from "../middleware/validate";
import { addToWishlistSchema, productIdParamSchema } from "../validators/wishlistValidator";

const router = Router()

// Add to wishlist - Validate body
router.post('/',
   protect,
   validate(addToWishlistSchema),
   addToWishlist
)

// Add to cart from wishlist - Validate params
router.post('/:productId/add-to-cart',
   protect,
   validateParams(productIdParamSchema),
   addToCartFromWishlist
)

// Get wishlist - No validation needed
router.get('/', protect, getWishlist)

// Clear wishlist - No validation needed
router.delete('/', protect, clearWishlist)

// Remove from wishlist - Validate params
router.delete('/:productId',
   protect,
   validateParams(productIdParamSchema),
   removeFromWishlist
)

export default router