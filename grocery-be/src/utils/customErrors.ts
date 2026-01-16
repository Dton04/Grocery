import { AppError } from './AppError'

/**
 * Validation Error - 400 Bad Request
 * Dùng khi dữ liệu không hợp lệ
 */
export class ValidationError extends AppError {
   constructor(message: string) {
      super(message, 400)
   }
}

/**
 * Not Found Error - 404 Not Found
 * Dùng khi không tìm thấy resource
 */
export class NotFoundError extends AppError {
   constructor(message: string) {
      super(message, 404)
   }
}

/**
 * Unauthorized Error - 401 Unauthorized
 * Dùng khi không có quyền truy cập
 */
export class UnauthorizedError extends AppError {
   constructor(message: string) {
      super(message, 401)
   }
}
