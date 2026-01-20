import * as dotenv from 'dotenv'

dotenv.config()

export const env = {
   PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
   MONGO_URI: process.env.MONGO_URI ?? '',
   NODE_ENV: process.env.NODE_ENV ?? 'development',
   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? '',
   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? '',
   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? ''
} as const
