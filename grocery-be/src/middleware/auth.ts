import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { User } from '../models/User'
import { UnauthorizedError } from '../utils/customErrors'

// TODO 1: Extend Request type để thêm user property
declare global {
   namespace Express {
      interface Request {
         user?: any  // Thêm property user vào Request
      }
   }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
   try {// TODO 2: Lấy Authorization header
      const authHeader = req.headers.authorization
      // TODO 3: Kiểm tra header có tồn tại và bắt đầu với "Bearer "
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw new UnauthorizedError('Vui lòng đăng nhập để truy cập')
      }

      // TODO 4: Extract token (lấy phần sau "Bearer ")
      const token = authHeader.split(' ')[1]!
      // TODO 5: Verify token
      const decoded = verifyToken(token)
      // TODO 6: Get user from database
      const user = await User.findById(decoded.userId)
      if (!user) {
         throw new UnauthorizedError('Vui lòng đăng nhập để truy cập')
      }
      if (!user.isActive) {
         throw new UnauthorizedError('Tài khoản đã bị vô hiệu hóa')
      }
      // TODO 7: Set user to request object
      req.user = user
      // TODO 8: Call next middleware
      next()
   } catch (error) {
      if (error instanceof UnauthorizedError) {
         throw error
      }
      throw new Error('Đăng nhập thất bại')
   }


}