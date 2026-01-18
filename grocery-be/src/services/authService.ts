import { User } from '../models/User'
import { IUserInput, IUserLogin, IAuthResponse } from '../types/user.types'
import { NotFoundError, ValidationError } from '../utils/customErrors'
import { generateToken } from '../utils/jwt'

export class AuthService {

   static async register(data: IUserInput): Promise<IAuthResponse> {
      const { email, password, fullName } = data

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
         throw new ValidationError('Email không hợp lệ')
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/
      if (!passwordRegex.test(password)) {
         throw new ValidationError('Password phải có ít nhất 5 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt')
      }

      const existingUser = await User.findOne({ email })
      if (existingUser) {
         throw new ValidationError('Email đã tồn tại')
      }

      const user = await User.create({ email, password, fullName })
      const token = generateToken(user._id)

      return {
         _id: user._id,
         email: user.email,
         fullName: user.fullName,
         role: user.role,
         token
      }
   }

   static async login(data: IUserLogin): Promise<IAuthResponse> {
      const { email, password } = data

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
         throw new ValidationError('Email không hợp lệ')
      }

      // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/
      // if (!passwordRegex.test(password)) {
      //    throw new ValidationError('Password phải có ít nhất 5 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt')
      // }

      const user = await User.findOne({ email })
      if (!user) {
         throw new NotFoundError('Email không tồn tại')
      }

      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
         throw new ValidationError('Mật khẩu không đúng')
      }

      const token = generateToken(user._id)

      return {
         _id: user._id,
         email: user.email,
         fullName: user.fullName,
         role: user.role,
         token
      }
   }




}
