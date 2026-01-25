import { Document, Types } from "mongoose";

export interface IWishlistItem {
   product: Types.ObjectId
   addedAt: Date
}

export interface IWishlist extends Document {
   user: Types.ObjectId
   items: IWishlistItem[]
   createdAt: Date
   updatedAt: Date
}

//input
export interface IAddToWishlistInput {
   productId: string
}