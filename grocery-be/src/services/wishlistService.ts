import { Wishlist } from "../models/Wishlist";
import { Product } from "../models/Product";
import { IWishlist, IAddToWishlistInput } from "../types/wishlist.types";
import { NotFoundError, ValidationError } from "../utils/customErrors";
import { CartService } from "./cartService";
export class WishlistService {
   static async addToWishlist(
      userId: string,
      input: IAddToWishlistInput
   ): Promise<IWishlist> {
      const product = await Product.findById(input.productId)
      if (!product) {
         throw new NotFoundError('Không tìm thấy sản phẩm')
      }

      let wishlist = await Wishlist.findOne({ user: userId })
      if (!wishlist) {
         wishlist = new Wishlist({
            user: userId,
            items: []
         })
      }

      //check if product already in wishlist
      const existingItem = wishlist.items.find(
         item => item.product.toString() === input.productId
      )
      if (existingItem) {
         throw new ValidationError('Sản phẩm đã có trong wishlist')
      }

      //TODO: Add to wishlist
      wishlist.items.push({
         product: product._id as any,
         addedAt: new Date()
      })

      await wishlist.save()
      await wishlist.populate('items.product', 'name price')

      return wishlist
   }

   static async getWishlist(userId: string): Promise<IWishlist | null> {
      const wishlist = await Wishlist.findOne({ user: userId })
         .populate('items.product', 'name price')
         .sort({ 'items.addedAt': -1 })

      return wishlist
   }

   static async removeFromWishlist(
      userId: string,
      productId: string
   ): Promise<IWishlist> {
      const wishlist = await Wishlist.findOne({ user: userId })
      if (!wishlist) {
         throw new NotFoundError('Không tìm thấy wishlist')
      }
      // check nếu sản phẩm có trong wishlist
      const existingItem = wishlist.items.find(
         item => item.product.toString() === productId
      )
      if (!existingItem) {
         throw new NotFoundError('Không tìm thấy sản phẩm trong wishlist')
      }
      wishlist.items = wishlist.items.filter(
         item => item.product.toString() !== productId
      )

      await wishlist.save()
      await wishlist.populate('items.product', 'name price')

      return wishlist
   }

   static async clearWishlist(userId: string): Promise<IWishlist> {
      const wishlist = await Wishlist.findOne({ user: userId })
      if (!wishlist) {
         throw new NotFoundError('Không tìm thấy wishlist')
      }

      wishlist.items = []   //clear
      await wishlist.save()

      return wishlist
   }

   // 5. BONUS: Add to cart from wishlist
   static async addToCartFromWishlist(
      userId: string,
      productId: string,
      quantity: number = 1
   ): Promise<{ wishlist: IWishlist, cart: any }> {
      // TODO: Import CartService
      // TODO: Add to cart
      const cart = await CartService.addToCart(
         userId, { productId, quantity }
      )
      // TODO: Remove from wishlist (optional)
      await this.removeFromWishlist(userId, productId)
      // TODO: Return both wishlist and cart
      const wishlist = await this.getWishlist(userId)
      return { wishlist: wishlist!, cart }

   }

}