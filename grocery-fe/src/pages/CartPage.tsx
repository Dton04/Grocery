import { useCartContext } from '../contexts/CartContext'
import { Button, Card, InputNumber } from 'antd'
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export const CartPage = () => {
   const { items, total, removeItem, updateQuantity, clearCart } = useCartContext()

   if (items.length === 0) {
      return (
         <div className="container mx-auto px-4 py-16 text-center">
            <ShoppingOutlined className="text-8xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng!</p>
            <Link to="/products">
               <Button type="primary" size="large">
                  Mua sắm ngay
               </Button>
            </Link>
         </div>
      )
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <h1 className="text-3xl font-bold mb-8">Giỏ Hàng</h1>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
               {items.map((item) => (
                  <Card key={item.product._id} className="mb-4">
                     <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <img
                           src={item.product.image || 'https://via.placeholder.com/100'}
                           alt={item.product.name}
                           className="w-24 h-24 object-cover rounded"
                        />

                        {/* Product Info */}
                        <div className="flex-1">
                           <h3 className="text-lg font-semibold">{item.product.name}</h3>
                           <p className="text-gray-600">
                              {item.product.price.toLocaleString('vi-VN')}đ / {item.product.unit}
                           </p>
                        </div>

                        {/* Quantity */}
                        <InputNumber
                           min={1}
                           max={item.product.stock}
                           value={item.quantity}
                           onChange={(value) => updateQuantity(item.product._id, value || 1)}
                        />

                        {/* Subtotal */}
                        <div className="text-right">
                           <p className="text-lg font-bold text-primary">
                              {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                           </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                           type="text"
                           danger
                           icon={<DeleteOutlined />}
                           onClick={() => removeItem(item.product._id)}
                        />
                     </div>
                  </Card>
               ))}

               <Button danger onClick={clearCart} className="mt-4">
                  Xóa tất cả
               </Button>
            </div>

            {/* Order Summary */}
            <div>
               <Card title="Tổng đơn hàng">
                  <div className="space-y-4">
                     <div className="flex justify-between">
                        <span>Số lượng:</span>
                        <span className="font-semibold">{items.length} sản phẩm</span>
                     </div>

                     <div className="flex justify-between text-xl font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">
                           {total.toLocaleString('vi-VN')}đ
                        </span>
                     </div>

                     <Button type="primary" block size="large">
                        Thanh toán
                     </Button>

                     <Link to="/products">
                        <Button block>Tiếp tục mua sắm</Button>
                     </Link>
                  </div>
               </Card>
            </div>
         </div>
      </div>
   )
}
