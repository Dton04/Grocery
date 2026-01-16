import { createContext, useContext, type ReactNode } from 'react'
import { useCart } from '../hooks/useCart'
import type { CartItem } from '../types/cart.types'
import type { Product } from '../types/product.types'

interface CartContextType {
   items: CartItem[]  // ← Fixed: item -> items
   total: number
   itemCount: number
   addItem: (product: Product) => void
   removeItem: (productId: string) => void
   updateQuantity: (productId: string, quantity: number) => void
   clearCart: () => void
}

//Tạo context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
   const cart = useCart()

   return (
      <CartContext.Provider value={cart}>
         {children}
      </CartContext.Provider>
   )
}

// custom hook để dùng context
export const useCartContext = () => {
   const context = useContext(CartContext)
   if (!context) {
      throw new Error('useCartContext must be used within a CartProvider')
   }
   return context
}