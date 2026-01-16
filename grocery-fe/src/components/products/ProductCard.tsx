import { Card, Button, Rate, Tag } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import type { Product } from '../../types/product.types'
import { useCartContext } from '../../contexts/CartContext'

interface ProductCardProps {
   product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
   const { addItem } = useCartContext()

   return (
      <Card
         hoverable
         cover={
            <div className="h-48 overflow-hidden">
               <img
                  alt={product.name}
                  src={product.image || 'https://via.placeholder.com/300'}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
               />
            </div>
         }
         className="shadow-md hover:shadow-xl transition-shadow"
      >
         {/* Product Name */}
         <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {product.name}
         </h3>

         {/* Description */}
         <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
         </p>

         {/* Rating */}
         {product.averageRating && (
            <div className="flex items-center gap-2 mb-3">
               <Rate
                  disabled
                  allowHalf
                  value={product.averageRating}
                  className="text-sm"
               />
               <span className="text-gray-500 text-sm">
                  ({product.numReviews || 0})
               </span>
            </div>
         )}

         {/* Price & Stock */}
         <div className="flex justify-between items-center mb-3">
            <div>
               <p className="text-2xl font-bold text-primary">
                  {product.price.toLocaleString('vi-VN')}đ
               </p>
               <p className="text-xs text-gray-500">
                  /{product.unit}
               </p>
            </div>

            {product.stock > 0 ? (
               <Tag color="success">Còn hàng</Tag>
            ) : (
               <Tag color="error">Hết hàng</Tag>
            )}
         </div>

         {/* Add to Cart Button */}
         <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            block
            size="large"
            disabled={product.stock === 0}
            onClick={() => addItem(product)}
            className="bg-primary hover:bg-green-600"
         >
            Thêm vào giỏ
         </Button>
      </Card>
   )
}
