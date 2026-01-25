import { Request, Response } from 'express'
import { WishlistService } from '../services/wishlistService'
import { asyncHandler } from '../utils/asyncHandler'

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const { productId } = req.body
   const wishlist = await WishlistService.addToWishlist(userId, { productId })
   res.status(200).json(wishlist)
})

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const wishlist = await WishlistService.getWishlist(userId)
   res.status(200).json({
      success: true,
      data: wishlist || { items: [], itemCount: 0 }
   })
})

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const { productId } = req.params as { productId: string }

   const wishlist = await WishlistService.removeFromWishlist(userId, productId)
   res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm khỏi wishlist thành công',
      data: wishlist
   })
})

// Clear wishlist
export const clearWishlist = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const wishlist = await WishlistService.clearWishlist(userId)
   res.status(200).json({
      success: true,
      message: 'Đã xóa toàn bộ danh sách yêu thích',
      data: wishlist
   })
})

export const addToCartFromWishlist = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user!._id.toString()
   const { productId } = req.params as { productId: string }
   const { quantity } = req.body

   const { wishlist, cart } = await WishlistService.addToCartFromWishlist(userId, productId, quantity)
   res.status(200).json({
      success: true,
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
      data: { wishlist, cart }
   })
})