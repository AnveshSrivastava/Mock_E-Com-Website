import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { getProducts, addToCart } from '@/api/api';

export const Products = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
      toast.success('Item added to cart!', {
        description: 'Check your cart to proceed to checkout',
      });
      onCartUpdate?.();
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return <Loader message="Loading products..." />;
  }

  if (products.length === 0) {
    return <EmptyState type="products" />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 sm:p-12 border border-border shadow-medium"
      >
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
          >
            Discover Your Style
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground mb-6"
          >
            Explore our curated collection of fashion and lifestyle products
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 text-sm"
          >
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">{products.length} Products</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Free Shipping</span>
            </div>
          </motion.div>
        </div>
      
        <div className="absolute top-0 right-0 w-64 h-64 gradient-primary rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 gradient-accent rounded-full opacity-10 blur-3xl"></div>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              isAdding={addingToCart === product.id}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
