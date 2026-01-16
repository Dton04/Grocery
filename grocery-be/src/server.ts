import { app } from './app'
import { env } from './config/env'
import { connectDB } from './config/db'

async function bootstrap(): Promise<void> {
   try {
      await connectDB()
      console.log('MongoDB connected')
   } catch (error) {
      console.error('MongoDB connection error:', error)
   }
   app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`)
   })
}

bootstrap().catch((err) => {
   console.error('Bootstrap error:', err)
   process.exit(1)
})