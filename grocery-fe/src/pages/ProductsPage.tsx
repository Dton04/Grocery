import { useState, useEffect } from "react";
import { ProductService } from "../services/productService";
import { ProductList } from "../components/products/ProductList";
import type { Product } from "../types/product.types";

export const ProductsPage = () => {
   const [products, setProducts] = useState<Product[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            setLoading(true)
            const response = await ProductService.getAll()
            setProducts(response.data)
         } catch (err) {
            setError('Không thể tải sản phẩm')
            console.error(err)
         } finally {
            setLoading(false)
         }
      }
      fetchProducts()
   }, [])

   // Render error
   if (error) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="text-center py-8 text-red-500">{error}</div>
         </div>
      )
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-8">Sản Phẩm</h1>
         <ProductList
            products={products}
            loading={loading}
         />
      </div>
   )
}