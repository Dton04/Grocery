import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d' // 7 ngày

/**
 * Tạo JWT token
 * @param userId - ID của user
 * @returns JWT token string
 */
export const generateToken = (userId: string): string => {
   return jwt.sign(
      { userId },                    // Payload
      JWT_SECRET,                    // Secret key
      { expiresIn: JWT_EXPIRES_IN }  // Thời gian hết hạn
   )
}

/**
 * Verify JWT token
 * @param token - JWT token cần verify
 * @returns Decoded payload
 */
export const verifyToken = (token: string): { userId: string } => {
   try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      return decoded
   } catch (error) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn')
   }
}
