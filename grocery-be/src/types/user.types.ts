export interface IUser {
   _id: string
   email: string
   password: string  // Hashed password
   fullName: string
   role: 'customer' | 'admin' | 'staff'
   isActive: boolean
   createdAt: Date
   updatedAt: Date
   token?: string
}

// Interface cho instance methods
export interface IUserMethods {
   comparePassword(password: string): Promise<boolean>
}

export type IUserInput = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>
export type IUserUpdate = Partial<Omit<IUserInput, 'password'>>
export type IUserLogin = Pick<IUser, 'email' | 'password'>
export type IAuthResponse = Pick<IUser, '_id' | 'email' | 'fullName' | 'role'> & { token: string }


export interface UserFilters {
   page?: number
   limit?: number
   role?: 'customer' | 'admin' | 'staff'
   isActive?: boolean
   search?: string
}

export interface IUserListResponse {
   users: IUser[]
   pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
   }
}