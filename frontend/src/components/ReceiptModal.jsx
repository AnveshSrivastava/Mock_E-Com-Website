import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatPrice';
import { useNavigate } from 'react-router-dom';

export const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  const navigate = useNavigate();
  
  if (!receipt) return null;
  
  const handleContinueShopping = () => {
    onClose();
    navigate('/');
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-card rounded-2xl shadow-large max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Animation */}
            <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex mb-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  ></motion.div>
                  <CheckCircle2 className="w-20 h-20 text-primary relative" />
                </div>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-foreground mb-2"
              >
                Order Successful!
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground"
              >
                Thank you for your purchase
              </motion.p>
            </div>
            
            {/* Receipt Details */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Receipt ID</span>
                <span className="font-mono font-semibold text-foreground">{receipt.id}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(receipt.total)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Date & Time</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(receipt.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
              
              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleContinueShopping}
                  className="w-full gradient-primary text-primary-foreground shadow-medium hover:shadow-large transition-smooth"
                  size="lg"
                >
                  Continue Shopping
                </Button>
                
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Close
                </Button>
              </div>
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
