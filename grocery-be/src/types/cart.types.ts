import { Document, Types } from 'mongoose'


export interface ICartItem {
   product: Types.ObjectId
   quantity: number
   price: number
}

//interface cho Cart document
export interface ICart extends Document {
   user: Types.ObjectId
   items: ICartItem[]
   totalPrice: number
   createdAt: Date
   updatedAt: Date
}

//interface cho input khi thêm sản phẩm
export interface IAddToCartInput {
   productId: string
   quantity: number
}

export interface IUpdateCartItemInput {
   quantity: number
}