import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const updateCartQuantity = async (productId, qty) => {
  try {
    // if (qty < 0) {
    //   const cart = await getCart();
    //   const cartItem = cart.items.find(item => item.productId === productId);
    //   if (cartItem) {
    //     if (cartItem.qty + qty <= 0) {
    //       return removeFromCart(cartItem._id);
    //     } else {
    //       const response = await api.post('/cart', { 
    //         productId, 
    //         qty: qty
    //       });
    //       return response.data;
    //     }
    //   }
    //   throw new Error('Item not found in cart');
    // }
    const response = await api.post('/cart', { productId, qty });
    return response.data;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    throw error;
  }
};

export const addToCart = async (productId, qty) => {
  try {
    return await updateCartQuantity(productId, qty);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const checkout = async (cartItems) => {
  try {
    const response = await api.post('/checkout', { cartItems });
    return response.data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};

export default api;
