import express from 'express'
import { createOrder, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/orderController'
import { protect } from '../middleware/auth'
import { authorize } from '../middleware/authorize'


const router = express.Router()

// Tất cả routes đều cần login
router.use(protect)

router.post('/', createOrder)
router.get('/', getMyOrders)
router.get('/:id', protect, getOrderById)
// Admin routes
router.put('/:id', authorize('admin'), updateOrderStatus)

export default router
