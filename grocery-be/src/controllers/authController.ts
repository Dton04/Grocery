import { asyncHandler } from '../utils/asyncHandler'
import { ValidationError } from '../utils/customErrors'
import { AuthService } from '../services/authService'

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

   // Validate input
   if (!email || !password || !fullName) {
      throw new ValidationError('Vui lòng điền đầy đủ thông tin')
   }

   const result = await AuthService.register({
      email,
      password,
      fullName,
      role: 'customer',
      isActive: true,
   })

   res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
         user: {
            _id: result._id,
            email: result.email,
            fullName: result.fullName,
            role: result.role,
         },
         token: result.token,
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

   // Validate input
   if (!email || !password) {
      throw new ValidationError('Vui lòng nhập email và password')
   }

   const result = await AuthService.login({ email, password })

   res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
         user: {
            _id: result._id,
            email: result.email,
            fullName: result.fullName,
            role: result.role,
         },
         token: result.token,
      },
   })
})