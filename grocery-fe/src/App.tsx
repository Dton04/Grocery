import { ProductCard } from './components/products/ProductCard'
import type { Product } from './types/product.types'
import './index.css'

const mockProduct: Product = {
  _id: '1',
  name: 'Gạo ST25 Sóc Trăng',
  description: 'Gạo thơm ngon, chất lượng cao từ Sóc Trăng. Hạt dài, trắng trong, thơm tự nhiên.',
  price: 50000,
  stock: 100,
  image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
  category: 'Gạo',
  unit: 'kg',
  averageRating: 4.5,
  numReviews: 120,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

function App() {
  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product)
    alert(`Đã thêm ${product.name} vào giỏ hàng!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Grocery Store - TypeScript + React
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            product={mockProduct}
            onAddToCart={handleAddToCart}
          />
          <ProductCard
            product={{ ...mockProduct, _id: '2', name: 'Gạo Jasmine', price: 45000 }}
            onAddToCart={handleAddToCart}
          />
          <ProductCard
            product={{ ...mockProduct, _id: '3', name: 'Gạo Nếp', price: 35000, stock: 0 }}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  )
}

export default App
