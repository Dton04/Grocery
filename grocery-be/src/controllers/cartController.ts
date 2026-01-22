import { Request, Response } from 'express'
import { CartService } from '../services/cartService'
import { asyncHandler } from '../utils/asyncHandler'

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const { productId, quantity } = req.body

   const cart = await CartService.addToCart(userId, {
      productId,
      quantity
   })
   res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart
   })
})

export const getCart = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const cart = await CartService.getCart(userId)
   res.status(200).json({
      success: true,
      data: cart || { items: [], totalPrice: 0 }
   })
})

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const { productId, quantity } = req.body
   const cart = await CartService.updateCartItem(userId, productId, {
      quantity
   })
   res.status(200).json({
      success: true,
      message: 'Đã cập nhật giỏ hàng',
      data: cart
   })
})

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const { productId } = req.params

   const cart = await CartService.removeFromCart(userId, productId as string)
   res.status(200).json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
      data: cart
   })
})

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const cart = await CartService.clearCart(userId)

   res.status(200).json({
      success: true,
      message: 'Đã xóa giỏ hàng',
      data: cart
   })

})