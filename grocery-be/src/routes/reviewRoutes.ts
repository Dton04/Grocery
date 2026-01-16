import express from 'express'
import {
   createReview,
   getProductReviews,
   deleteReview
} from '../controllers/reviewController'
import { protect } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
const router = express.Router()

// Route tạo review (cần login)
router.post('/products/:productId', protect, createReview)

// Route lấy reviews (public)
router.get('/products/:productId', getProductReviews)

// Route xóa review (cần login)
router.delete('/:id', protect, authorize('admin', 'user'), deleteReview)
export default router