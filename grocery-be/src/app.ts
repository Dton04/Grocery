import express from 'express'
import type { Application, Request, Response } from 'express'
import cors from 'cors'
import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/categoryRoutes'
import authRoutes from './routes/authRoutes'
import { errorHandler } from './middleware/errorHandler'
import { logger } from './middleware/logger'
import orderRoutes from './routes/orderRoutes'
import reviewRoutes from './routes/reviewRoutes'


export const app: Application = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)
// API Routes
app.use('/api/products', productRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)

// Health check route
app.get('/', (req: Request, res: Response) => {
   res.json({
      message: 'Grocery API is running',
      status: 'OK',
      timestamp: new Date().toISOString(),
   })
})

// API routes will be added here
// app.use('/api/v1', routes)

// 404 handler
app.use((req: Request, res: Response) => {
   res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.path,
   })
})

// Error Handler (PHẢI Ở CUỐI CÙNG!)
app.use(errorHandler)
