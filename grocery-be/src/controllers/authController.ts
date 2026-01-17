import { User } from '../models/User'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/customErrors'
import { generateToken } from '../utils/jwt'

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Validation error
 */
export const register = asyncHandler(async (req, res) => {
   const { email, password, fullName } = req.body

   // Validation
   if (!email || !password || !fullName) {
      throw new ValidationError('Vui lòng điền đầy đủ thông tin')
   }

   // Kiểm tra email đã tồn tại chưa
   const existingUser = await User.findOne({ email })
   if (existingUser) {
      throw new ValidationError('Email đã được sử dụng')
   }

   // Tạo user (password sẽ tự động hash bởi pre-save middleware)
   const user = await User.create({
      email,
      password,
      fullName,
   })

   // Tạo JWT token
   const token = generateToken(user._id)

   res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
         user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
         },
         token,
      },
   })
})

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export const login = asyncHandler(async (req, res) => {
   const { email, password } = req.body

   // Validation
   if (!email || !password) {
      throw new ValidationError('Vui lòng nhập email và password')
   }

   // Tìm user
   const user = await User.findOne({ email })

   if (!user) {
      throw new NotFoundError('Email không tồn tại')
   }

   // So sánh password (gọi trên instance 'user', KHÔNG phải Model 'User')
   const isMatch = await user.comparePassword(password)

   if (!isMatch) {
      throw new UnauthorizedError('Sai mật khẩu')
   }

   // Tạo JWT token
   const token = generateToken(user._id)

   res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
         user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
         },
         token,
      },
   })
})