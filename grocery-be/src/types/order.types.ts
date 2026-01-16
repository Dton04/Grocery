import { Types } from 'mongoose'

export interface IOrderItem {
   product: Types.ObjectId
   quantity: number
   price: number
   unit: string
}

export interface IOrder {
   _id: string
   user: Types.ObjectId
   items: IOrderItem[]
   totalAmount: number
   status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
   shippingAddress: string
   note?: string
   createdAt: Date
   updatedAt: Date
}

// Interface cho static methods
export interface IOrderStatics {
   findByUser(userId: string): any
}

export type IOrderInput = Omit<IOrder, '_id' | 'totalAmount' | 'createdAt' | 'updatedAt'>

export type IOrderUpdate = Partial<Pick<IOrder, 'status' | 'shippingAddress' | 'note'>>