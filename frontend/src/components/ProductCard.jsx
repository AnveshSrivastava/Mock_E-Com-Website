import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/utils/formatPrice';

export const ProductCard = ({ product, onAddToCart, isAdding }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-border hover:border-primary/30 transition-smooth group h-full flex flex-col shadow-soft hover:shadow-medium">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-muted-foreground/10 group-hover:scale-110 transition-smooth">
              {product.name.charAt(0)}
            </div>
          </div>
          {/* Hover overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent"
          >
            <div className="absolute bottom-4 left-4 right-4 text-card text-sm font-medium">
              Click to add to cart
            </div>
          </motion.div>
        </div>
        
        <CardContent className="p-4 flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            onClick={() => onAddToCart(product.id)}
            disabled={isAdding}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium transition-smooth"
            size="lg"
          >
            <motion.div 
              className="flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </motion.div>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
