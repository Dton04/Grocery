import { Request, Response, NextFunction } from 'express'

/**
 * Async Handler Wrapper
 * Tự động catch lỗi từ async functions và chuyển cho error middleware
 * 
 * @param fn - Async function cần wrap
 * @returns Function đã được wrap với error handling
 */
export const asyncHandler = (
   fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
   return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next)
   }
}
