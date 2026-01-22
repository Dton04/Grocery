import { Cart } from "../models/Cart"
import { Product } from "../models/Product"
import { ICart, IAddToCartInput, IUpdateCartItemInput } from "../types/cart.types"
import { NotFoundError, ValidationError } from '../utils/customErrors'

export class CartService {

   static async addToCart(
      userId: string,
      input: IAddToCartInput
   ): Promise<ICart> {
      const product = await Product.findById(input.productId)
      if (!product) {
         throw new NotFoundError('Không tìm thấy sản phẩm')
      }

      if (product.stock < input.quantity) {
         throw new ValidationError('Hàng không đủ')
      }
      let cart = await Cart.findOne({ user: userId })

      if (!cart) {
         cart = new Cart({
            user: userId,
            items: []
         })
      }

      const existingItemIndex = cart!.items.findIndex(
         item => item.product.toString() === input.productId
      )

      if (existingItemIndex > -1) {
         // Sản phẩm đã có → Tăng quantity
         cart!.items[existingItemIndex]!.quantity += input.quantity
      } else {
         // Sản phẩm chưa có → Thêm mới
         cart!.items.push({
            product: product._id as any,
            quantity: input.quantity,
            price: product.price
         })
      }

      //Save và populate
      await cart.save()
      await cart!.populate('items.product')

      return cart
   }
   static async getCart(userId: string): Promise<ICart | null> {
      const cart = await Cart.findOne({ user: userId })
         .populate('items.product')
      return cart
   }

   static async updateCartItem(
      userId: string,
      productId: string,
      input: IUpdateCartItemInput): Promise<ICart> {
      const cart = await Cart.findOne({ user: userId })
      if (!cart) {
         throw new NotFoundError('Không tìm thấy giỏ hàng')
      }

      const itemIndex = cart.items.findIndex(
         item => item.product.toString() === productId
      )
      // tifm item trong cart
      if (itemIndex === -1) {
         throw new NotFoundError('Không tìm thấy sản phẩm trong giỏ hàng')
      }
      const product = await Product.findById(productId)
      if (!product) {
         throw new NotFoundError('Không tìm thấy sản phẩm')
      }
      cart.items[itemIndex]!.quantity = input.quantity

      await cart.save()
      await cart.populate('items.product')

      return cart
   }

   static async removeFromCart(
      userId: string,
      productId: string
   ): Promise<ICart> {
      const cart = await Cart.findOne({ user: userId })
      if (!cart) {
         throw new NotFoundError('Không tìm thấy giỏ hàng')
      }
      cart.items = cart.items.filter(
         item => item.product.toString() !== productId
      )

      await cart.save()
      await cart.populate('items.product')

      return cart
   }

   static async clearCart(userId: string): Promise<ICart> {
      const cart = await Cart.findOne({ user: userId })
      if (!cart) {
         throw new NotFoundError('Không tìm thấy giỏ hàng')
      }
      cart.items = []
      await cart.save()
      return cart
   }

}