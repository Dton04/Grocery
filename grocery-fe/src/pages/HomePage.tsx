import { Link } from 'react-router-dom'
import { ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'

export const HomePage = () => {
   return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
         <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
               <h1 className="text-6xl font-bold text-gray-800 mb-4">
                  🛒 Grocery Store
               </h1>
               <p className="text-xl text-gray-600 mb-8">
                  Mua sắm thực phẩm tươi ngon, giao hàng tận nơi
               </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
               <Link
                  to="/products"
                  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
               >
                  <ShoppingOutlined className="text-6xl text-green-600 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Sản Phẩm</h2>
                  <p className="text-gray-600">Xem tất cả sản phẩm</p>
               </Link>

               <Link
                  to="/cart"
                  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
               >
                  <ShoppingCartOutlined className="text-6xl text-blue-600 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Giỏ Hàng</h2>
                  <p className="text-gray-600">Xem giỏ hàng của bạn</p>
               </Link>

               <Link
                  to="/login"
                  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
               >
                  <UserOutlined className="text-6xl text-purple-600 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Đăng Nhập</h2>
                  <p className="text-gray-600">Đăng nhập tài khoản</p>
               </Link>
            </div>
         </div>
      </div>
   )
}
