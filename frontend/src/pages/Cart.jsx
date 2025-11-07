import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { ReceiptModal } from '@/components/ReceiptModal';
import { getCart, addToCart, removeFromCart, checkout, updateCartQuantity } from '@/api/api';
import { formatPrice } from '@/utils/formatPrice';

export const Cart = ({ onCartUpdate }) => {
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCloseReceipt = async () => {
    setShowReceipt(false);
    setReceipt(null);
    await fetchCart();
    onCartUpdate?.();
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartData(data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, currentQty, change) => {
    try {
      setUpdating(itemId);
      const item = cartData.items.find((i) => i.id === itemId);
      
      if (!item) {
        throw new Error('Item not found in cart');
      }

      const newQty = currentQty + change;
      
      if (newQty <= 0) {
        await removeFromCart(itemId);
        toast.success('Item removed from cart');
      } else {
        const updateQty = (change > 0) ? 1 : -1;
        await addToCart(item.productId, updateQty);
      }
      
      await fetchCart();
      onCartUpdate?.();
    } catch (error) {
      console.error('Update quantity error:', error);
      toast.error(error.response?.data?.error || 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdating(itemId);
      await removeFromCart(itemId);
      await fetchCart();
      onCartUpdate?.();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setCheckingOut(true);
      const response = await checkout(cartData.items);
      setReceipt(response.receipt || response);
      setShowReceipt(true);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <Loader message="Loading cart..." />;
  }

  if (cartData.items.length === 0) {
    return <EmptyState type="cart" />;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">Your Cart</h1>
        <p className="text-muted-foreground">
          {cartData.items.length} {cartData.items.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartData.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-smooth">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Images */}
                    <div className="relative w-full sm:w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-muted-foreground/20">
                        {item.name.charAt(0)}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold text-xl mb-3">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateQuantity(item.id, item.qty, -1)}
                            disabled={updating === item.id || item.qty <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-foreground">
                            {item.qty}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateQuantity(item.id, item.qty, 1)}
                            disabled={updating === item.id}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Subtotal: <span className="font-semibold text-foreground">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating === item.id}
                      className="self-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-24 shadow-medium border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartData.total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-secondary font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(cartData.total)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="transition-smooth"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="transition-smooth"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCheckout}
                disabled={checkingOut || !formData.name || !formData.email}
                className="w-full gradient-primary text-primary-foreground shadow-medium hover:shadow-large transition-smooth"
                size="lg"
              >
                <motion.span whileTap={{ scale: 0.95 }}>
                  {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                </motion.span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        receipt={receipt}
      />
    </div>
  );
};
