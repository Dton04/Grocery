/**
 * Custom Error Class
 * Kế thừa từ Error built-in của JavaScript
 */
export class AppError extends Error {
   statusCode: number
   isOperational: boolean

   constructor(message: string, statusCode: number) {
      super(message) // Gọi constructor của Error

      this.statusCode = statusCode
      this.isOperational = true // Lỗi có thể dự đoán được (operational error)

      // Capture stack trace để dễ debug
      Error.captureStackTrace(this, this.constructor)
   }
}
