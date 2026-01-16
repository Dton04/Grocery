import * as dotenv from 'dotenv'

dotenv.config()

export const env = {
   PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
   MONGO_URI: process.env.MONGO_URI ?? '',
   NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const
