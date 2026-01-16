import type { Product } from "./product.types"

export interface CartItem {
   product: Product
   quantity: number
}

export interface Cart {
   items: CartItem[]
   total: number
}

// Tạo type CartAction cho useReducer

export type CartActionType =
   | { type: 'ADD_ITEM'; payload: Product }
   | { type: 'REMOVE_ITEM'; payload: string }
   | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
   | { type: 'CLEAR_CART' }