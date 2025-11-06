import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export const Navbar = ({ cartCount = 0 }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-soft"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-lg opacity-20 blur-sm group-hover:opacity-30 transition-smooth"></div>
              <div className="relative bg-card p-2 rounded-lg border border-border">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Vibe Commerce</h1>
              <p className="text-xs text-muted-foreground">Fashion & Lifestyle</p>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/"
              className={`relative px-4 py-2 text-sm font-medium transition-smooth rounded-lg ${
                isActive('/') 
                  ? 'text-primary bg-accent' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Products
              {isActive('/') && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 gradient-primary opacity-10 rounded-lg"
                />
              )}
            </Link>
            
            <Link 
              to="/cart"
              className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-smooth rounded-lg ${
                isActive('/cart') 
                  ? 'text-primary bg-accent' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <Badge 
                  variant="default" 
                  className="ml-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 min-w-[20px] h-5 flex items-center justify-center"
                >
                  {cartCount}
                </Badge>
              )}
              {isActive('/cart') && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 gradient-primary opacity-10 rounded-lg"
                />
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
