import { useState } from "react";
import type { Product } from "../types/product.types"
import type { CartItem } from "../types/cart.types"

export const useCart = () => {
   const [items, setItems] = useState<CartItem[]>([])

   // Function thêm sản phẩm
   const addItem = (product: Product) => {
      setItems((prevItems) => {
         const existingItem = prevItems.find((item) => item.product._id === product._id)

         if (existingItem) {
            // Tăng quantity nếu đã có
            return prevItems.map((item) =>
               item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
            )
         }

         // Thêm sản phẩm mới
         return [...prevItems, { product, quantity: 1 }]
      })
   }

   // Function xóa sản phẩm
   const removeItem = (productId: string) => {
      setItems((prevItems) =>
         prevItems.filter((item) => item.product._id !== productId)
      )
   }

   // Function update số lượng
   const updateQuantity = (productId: string, quantity: number) => {
      if (quantity <= 0) {
         removeItem(productId)
         return
      }

      setItems((prevItems) =>
         prevItems.map(item =>
            item.product._id === productId
               ? { ...item, quantity }
               : item
         )
      )
   }

   // Function clear cart
   const clearCart = () => {
      setItems([])
   }

   // Tính total
   const total = items.reduce((sum, item) =>
      sum + item.product.price * item.quantity, 0
   )

   return {
      items,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount: items.length
   }
}