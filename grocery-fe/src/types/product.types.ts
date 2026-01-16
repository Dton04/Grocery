export interface Product {
   _id: string
   name: string
   description: string
   price: number
   stock: number
   image: string
   category: string
   unit: string
   averageRating?: number
   numReviews?: number
   createdAt: string
   updatedAt: string
}

// TODO: Tạo type cho Product list response
export interface ProductListResponse {
   success: boolean
   data: Product[]
}

// TODO: Tạo type cho Product detail response
export interface ProductDetailResponse {
   success: boolean
   data: Product
}
