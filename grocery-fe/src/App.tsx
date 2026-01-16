import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { ProductsPage } from './pages/ProductsPage'
import { CartPage } from './pages/CartPage'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import './index.css'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
