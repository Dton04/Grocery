import mongoose, { Schema, Model } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser, IUserMethods } from '../types/user.types'

// Type cho User document (IUser + methods)
type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
   {
      email: {
         type: String,
         required: [true, 'Email là bắt buộc'],
         unique: true,
         lowercase: true,
         trim: true
      },
      password: {
         type: String,
         required: [true, 'Password là bắt buộc'],
         minlength: [6, 'Password phải ít nhất 6 ký tự']
      },
      fullName: {
         type: String,
         required: [true, 'Họ tên là bắt buộc'],
         trim: true
      },
      role: {
         type: String,
         enum: ['customer', 'admin', 'staff'],
         default: 'customer'
      },
      isActive: {
         type: Boolean,
         default: true
      }
   },
   {
      timestamps: true
   }
)

/**
 * Pre-save middleware
 * Hash password trước khi lưu vào database
 */
userSchema.pre('save', async function () {
   // Chỉ hash nếu password được thay đổi (tạo mới hoặc update)
   if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10)
   }
})

/**
 * Instance method
 * So sánh password khi login
 */
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
   return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model<IUser, UserModel>('User', userSchema)