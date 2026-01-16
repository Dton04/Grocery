import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'

/**
 * Global Error Handler Middleware
 * Xử lý tất cả lỗi trong ứng dụng
 * 
 * QUAN TRỌNG: Phải có 4 tham số (err, req, res, next) để Express nhận diện là error middleware
 */
export const errorHandler = (
   err: Error | AppError,
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   // Default values
   let statusCode = 500
   let message = 'Lỗi server'

   // Nếu là AppError (lỗi tự throw)
   if (err instanceof AppError) {
      statusCode = err.statusCode
      message = err.message
   }

   // Mongoose Validation Error
   if (err.name === 'ValidationError') {
      statusCode = 400
      message = 'Dữ liệu không hợp lệ'
   }

   // Mongoose Cast Error (Invalid ObjectId)
   if (err.name === 'CastError') {
      statusCode = 400
      message = 'ID không hợp lệ'
   }

   // Mongoose Duplicate Key Error
   if ((err as any).code === 11000) {
      statusCode = 400
      message = 'Dữ liệu đã tồn tại'
   }

   // Log error (chỉ ở development)
   if (process.env.NODE_ENV === 'development') {
      console.error('ERROR 💥:', err)
   }

   // Send response
   res.status(statusCode).json({
      success: false,
      message,
      // Chỉ show error details ở development
      ...(process.env.NODE_ENV === 'development' && {
         error: err.message,
         stack: err.stack,
      }),
   })
}
