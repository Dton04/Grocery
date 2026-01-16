import { User } from '../models/User'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/customErrors'
import { generateToken } from '../utils/jwt'

/**
 * @desc    Đăng ký user mới
 * @route   POST /api/auth/register
 * @access  Public
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
 * @desc    Đăng nhập
 * @route   POST /api/auth/login
 * @access  Public
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