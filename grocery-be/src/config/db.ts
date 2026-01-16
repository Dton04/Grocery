import mongoose from 'mongoose'
import { env } from './env'

export async function connectDB(): Promise<void> {
   if (!env.MONGO_URI) {
      throw new Error('Missing MONGO_URI')
   }

   await mongoose.connect(env.MONGO_URI)

}
