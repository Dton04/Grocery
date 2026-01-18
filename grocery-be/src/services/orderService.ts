// TODO: Implement OrderService
// Tham khảo: AuthService và ProductService
// Lưu ý: OrderService phức tạp hơn vì có:
// - Validate stock
// - Update stock khi tạo/hủy order
// - Validate status workflow
// - Populate relationships

import { Order } from "../models/Order"
import { IOrder, IOrderInput, IOrderUpdate } from "../types/order.types"
import { NotFoundError, ValidationError } from "../utils/customErrors"
import { Product } from "../models/Product"

export class OrderService {
   static async createOrder(data: IOrderInput): Promise<IOrder> {
      if (!data.items || data.items.length === 0) {
         throw new ValidationError('Đơn hàng phải có ít nhất 1 sản phẩm')
      }
      //Loop qua TỪNG item để validate
      for (const item of data.items) {
         const product = await Product.findById(item.product)
         if (!product) {
            throw new NotFoundError('Sản phẩm không tồn tại')
         }
         if (product.stock < item.quantity) {
            throw new ValidationError(`Sản phẩm ${product.name} không đủ.
               Còn lại ${product.stock}`)
         }
      }

      const order = await Order.create(data)

      for (const item of data.items) {
         await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }  // Giảm stock
         })
      }

      await order.populate('user', 'fullName email')
      await order.populate('items.product', 'name price imageUrl')
      return order
   }

   static async updateOrderStatus(id: string, status: IOrder['status']): Promise<IOrder> {
      const order = await Order.findById(id)
      if (!order) {
         throw new NotFoundError('Đơn hàng không tồn tại')
      }

      const validTransitions: Record<string, string[]> = {
         pending: ['confirmed', 'cancelled'],
         confirmed: ['shipping', 'cancelled'],
         shipping: ['delivered'],
         delivered: [],
         cancelled: []
      }

      if (!validTransitions[order.status]?.includes(status)) {
         throw new ValidationError(`Không thể chuyển từ ${order.status} sang ${status}`)
      }

      // Hoàn stock nếu cancel
      if (status === 'cancelled' && order.status !== 'cancelled') {
         for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
         }
      }

      order.status = status
      await order.save()
      return order
   }

   static async getAllOrders(filters?: {
      userId?: string
      status?: string
      page?: number
      limit?: number
   }): Promise<{
      orders: IOrder[]
      pagination: {
         page: number
         limit: number
         total: number
         totalPages: number
      }
   }> {
      const { userId, status, page = 1, limit = 10 } = filters || {}

      const filter: any = {}

      if (userId) {
         filter.user = userId
      }

      if (status) {
         filter.status = status
      }

      const skip = (page - 1) * limit

      const orders = await Order.find(filter)
         .populate('user', 'fullName email')
         .populate('items.product', 'name price imageUrl')
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 })

      const total = await Order.countDocuments(filter)

      return {
         orders,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
         }
      }
   }

   static async getOrderById(id: string): Promise<IOrder> {
      const order = await Order.findById(id)
         .populate('user', 'fullName email phone')
         .populate('items.product', 'name price imageUrl')

      if (!order) {
         throw new NotFoundError('Không tìm thấy đơn hàng')
      }

      return order
   }

   static async getOrdersByUser(userId: string): Promise<IOrder[]> {
      const orders = await Order.find({ user: userId })
         .populate('user', 'fullName email')
         .populate('items.product', 'name price')
         .sort({ createdAt: -1 })
      return orders
   }

   static async updateOrder(id: string, data: IOrderUpdate): Promise<IOrder> {
      const order = await Order.findByIdAndUpdate(
         id,
         data,
         { new: true, runValidators: true }
      )

      if (!order) {
         throw new NotFoundError('Không tìm thấy đơn hàng')
      }

      return order
   }

   static async deleteOrder(id: string): Promise<void> {
      const order = await Order.findById(id)

      if (!order) {
         throw new NotFoundError('Không tìm thấy đơn hàng')
      }

      if (order.status !== 'pending') {
         throw new ValidationError('Chỉ có thể xóa đơn hàng đang chờ xử lý')
      }

      for (const item of order.items) {
         await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
         })
      }

      await Order.findByIdAndDelete(id)
   }
}