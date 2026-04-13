import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="relative"
      >
        <div className="absolute inset-0 gradient-primary rounded-full opacity-20 blur-xl"></div>
        <div className="relative bg-card p-6 rounded-full border-2 border-primary/20 shadow-large">
          <Package className="w-12 h-12 text-primary" />
        </div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-muted-foreground font-medium"
      >
        {message}
      </motion.p>
      
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        ))}
      </div>
    </div>
  );
};
