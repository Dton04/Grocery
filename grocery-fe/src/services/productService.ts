import { api } from "./api";
import type { ProductListResponse, ProductDetailResponse } from "../types/product.types";

export class ProductService {
   // GET /api/products
   static async getAll(): Promise<ProductListResponse> {
      const response = await api.get<any>('/products')
      // Backend returns: { success: true, data: { products: [...], pagination: {...} } }
      return {
         success: response.data.success,
         data: response.data.data.products
      }
   }

   // GET /api/products/:id
   static async getById(id: string): Promise<ProductDetailResponse> {
      const response = await api.get<ProductDetailResponse>(`/products/${id}`)
      return response.data
   }

   // GET /api/products?search=query
   static async search(query: string): Promise<ProductListResponse> {
      const response = await api.get<ProductListResponse>('/products', {
         params: { search: query }
      })
      return response.data
   }
}

