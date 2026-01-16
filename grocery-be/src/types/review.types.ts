import { Types } from "mongoose";

export interface IReview {
   _id: string
   user: Types.ObjectId
   product: Types.ObjectId
   rating: number
   comment: string
   createdAt: Date
   updatedAt: Date
}

export type IReviewInput = Omit<IReview, '_id' | 'createdAt' | 'updatedAt'>

export type IReviewUpdate = Partial<Pick<IReview, 'rating' | 'comment'>>