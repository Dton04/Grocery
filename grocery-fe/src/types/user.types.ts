export interface User {
   _id: string
   email: string
   password: string
   name: string
   role: 'customer' | 'admin' | 'staff'
   isActive: boolean
}

export interface LoginRequest {
   email: string
   password: string
}

export interface AuthResponse {
   success: boolean
   data: {
      user: User
      token: string
   }
}