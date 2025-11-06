import React from 'react';
import { ShoppingBag, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyState = ({ type = 'cart' }) => {
  const navigate = useNavigate();
  
  const content = {
    cart: {
      icon: ShoppingBag,
      title: 'Your cart is empty',
      description: 'Add some amazing products to get started!',
      buttonText: 'Continue Shopping',
      buttonAction: () => navigate('/')
    },
    products: {
      icon: Package,
      title: 'No products found',
      description: 'Check back later for amazing deals!',
      buttonText: 'Refresh',
      buttonAction: () => window.location.reload()
    }
  };
  
  const { icon: Icon, title, description, buttonText, buttonAction } = content[type];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 gradient-primary rounded-full opacity-10 blur-2xl"></div>
        <div className="relative bg-muted p-8 rounded-full">
          <Icon className="w-16 h-16 text-muted-foreground" />
        </div>
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-foreground mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground mb-8 max-w-md"
      >
        {description}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={buttonAction}
          size="lg"
          className="gradient-primary text-primary-foreground shadow-medium hover:shadow-large transition-smooth"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
};
