import { Order } from '../models/Order'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/customErrors'

/**
 * @desc    Tạo order mới
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
export const createOrder = asyncHandler(async (req, res) => {
   const { items, shippingAddress, note } = req.body

   // Validation
   if (!items || items.length === 0) {
      throw new ValidationError('Đơn hàng phải có ít nhất 1 sản phẩm')
   }

   if (!shippingAddress) {
      throw new ValidationError('Địa chỉ giao hàng là bắt buộc')
   }

   // Tạo order với user từ req.user (protect middleware)
   const order = await Order.create({
      user: req.user._id,  // ← Từ protect middleware
      items,
      shippingAddress,
      note,
   })

   // Populate để trả về thông tin đầy đủ
   await order.populate('user', 'fullName email')
   await order.populate('items.product', 'name price')

   res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: order,
   })
})

/**
 * @desc    Lấy orders của user hiện tại
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
   // Dùng sẽ không báo lỗi đỏ

   // const orders = await Order.find({ user: req.user._id })
   //    .populate('user', 'fullName email')
   //    .populate('items.product', 'name price')
   //    .sort({ createdAt: -1 })

   const orders = await Order.findByUser(req.user._id)

   res.json({
      success: true,
      data: orders
   })
})

/**
 * @desc    Lấy id order
 * @route   GET /api/orders/:id
 * @access  Private
 */

export const getOrderById = asyncHandler(async (req, res) => {
   const { id } = req.params
   const order = await Order.findById(id)
   if (!order) {
      throw new NotFoundError('Không tìm thấy đơn hàng')
   }

   //Check user
   if (order.user.toString() !== req.user._id.toString()) {
      throw new UnauthorizedError('Bạn không có quyền truy cập đơn hàng này')
   }

   res.json({
      success: true,
      data: order
   })
})

// Update order status (Admin only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
   const { status } = req.body
   const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
   )
   if (!order) {
      throw new NotFoundError('Không tìm thấy đơn hàng')
   }

   res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: order
   })

})