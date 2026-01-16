export interface IUser {
   _id: string
   email: string
   password: string  // Hashed password
   fullName: string
   role: 'customer' | 'admin' | 'staff'
   isActive: boolean
   createdAt: Date
   updatedAt: Date
}

// Interface cho instance methods
export interface IUserMethods {
   comparePassword(password: string): Promise<boolean>
}

export type IUserInput = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>
export type IUserUpdate = Partial<Omit<IUserInput, 'password'>>
export type IUserLogin = Pick<IUser, 'email' | 'password'>