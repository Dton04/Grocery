import { asyncHandler } from '../utils/asyncHandler'
import { ValidationError } from '../utils/customErrors'
import { OrderService } from '../services/orderService'
import { IOrderInput } from '../types/order.types'

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     description: Tạo đơn hàng với danh sách sản phẩm và địa chỉ giao hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                       example: "507f1f77bcf86cd799439011"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 50000
 *                     unit:
 *                       type: string
 *                       example: "kg"
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Nguyễn Văn A, Quận 1, TP.HCM"
 *               note:
 *                 type: string
 *                 example: "Giao hàng buổi sáng"
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export const createOrder = asyncHandler(async (req, res) => {
   const { items, shippingAddress, note } = req.body

   if (!items || items.length === 0) {
      throw new ValidationError('Đơn hàng phải có ít nhất 1 sản phẩm')
   }

   if (!shippingAddress) {
      throw new ValidationError('Địa chỉ giao hàng là bắt buộc')
   }

   const orderData: IOrderInput = {
      user: req.user._id,
      items,
      shippingAddress,
      note,
      status: 'pending'
   }

   const order = await OrderService.createOrder(orderData)

   res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: order,
   })
})

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của user
 *     description: Lấy tất cả đơn hàng của user hiện tại
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *       401:
 *         description: Unauthorized
 */
export const getMyOrders = asyncHandler(async (req, res) => {
   const orders = await OrderService.getOrdersByUser(req.user._id.toString())

   res.json({
      success: true,
      data: orders
   })
})

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     description: Lấy thông tin chi tiết của một đơn hàng theo ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Lấy đơn hàng thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không có quyền truy cập
 */

export const getOrderById = asyncHandler(async (req, res) => {
   const { id } = req.params

   const order = await OrderService.getOrderById(id as string)

   // Check if user owns this order (unless admin)
   if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new ValidationError('Bạn không có quyền truy cập đơn hàng này')
   }

   res.json({
      success: true,
      data: order
   })
})

/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     summary: Lấy tất cả đơn hàng (Admin)
 *     description: Lấy danh sách tất cả đơn hàng với filter và pagination
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipping, delivered, cancelled]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Lọc theo user ID
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Chỉ admin mới có quyền
 */
export const getAllOrders = asyncHandler(async (req, res) => {
   const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      status: req.query.status as string,
      userId: req.query.userId as string
   }

   const result = await OrderService.getAllOrders(filters)

   res.json({
      success: true,
      data: result
   })
})

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng (Admin)
 *     description: Cập nhật trạng thái đơn hàng theo workflow
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipping, delivered, cancelled]
 *                 example: "confirmed"
 *                 description: |
 *                   Workflow:
 *                   - pending → confirmed, cancelled
 *                   - confirmed → shipping, cancelled
 *                   - shipping → delivered
 *                   - delivered → (không thể chuyển)
 *                   - cancelled → (không thể chuyển)
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Workflow không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Chỉ admin mới có quyền
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
   const { id } = req.params
   const { status } = req.body

   if (!status) {
      throw new ValidationError('Status là bắt buộc')
   }

   const order = await OrderService.updateOrderStatus(id as string, status)

   res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: order
   })
})
