import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/Navbar';
import { Products } from '@/pages/Products';
import { Cart } from '@/pages/Cart';
import { getCart } from '@/api/api';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    try {
      const data = await getCart();
      const count = data.items.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar cartCount={cartCount} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <Routes>
            <Route path="/" element={<Products onCartUpdate={updateCartCount} />} />
            <Route path="/cart" element={<Cart onCartUpdate={updateCartCount} />} />
          </Routes>
        </main>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </BrowserRouter>
  );
}

export default App;
