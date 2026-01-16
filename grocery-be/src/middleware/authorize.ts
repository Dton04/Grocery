/**
 * Middleware kiểm tra authorization (role-based)
 * @param roles - Danh sách roles được phép truy cập
 */
import { Request, Response, NextFunction } from "express"
import { UnauthorizedError } from "../utils/customErrors"
export const authorize = (...roles: string[]) => {
   // TODO 1: Return một middleware function
   return (req: Request, res: Response, next: NextFunction) => {
      // TODO 2: Kiểm tra req.user có tồn tại không
      if (!req.user) {
         throw new UnauthorizedError('Vui lòng đăng nhập để truy cập')
      }
      // TODO 3: Kiểm tra role của user có trong danh sách roles không
      if (!roles.includes(req.user.role)) {
         throw new UnauthorizedError('Vui lòng đăng nhập để truy cập')
      }
      // TODO 4: Nếu OK, gọi next()
      next()
   }
}