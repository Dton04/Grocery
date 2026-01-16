import { ProductCard } from "./ProductCard";
import type { Product } from "../../types/product.types";

interface ProductListProps {
   products: Product[]
   loading?: boolean
   onAddToCart?: (product: Product) => void
}

export const ProductList = ({ products, loading, onAddToCart }: ProductListProps) => {
   if (loading) {
      return <div className="text-center py-8">Loading...</div>
   }

   if (!products.length) {
      return <div className="text-center py-8">No products found</div>
   }

   //Hiển thị empty state
   if (products.length === 0) {
      return <div className="text-center py-8">Không có sản phẩm nào</div>
   }

   //Hiển thị grid products
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {products.map((product) => (
            <ProductCard
               key={product._id}
               product={product}
               onAddToCart={onAddToCart}
            />
         ))}
      </div>
   )


}