import React, { createContext, useState, useEffect } from "react";
import { getCart } from "../api/api";
import api from "../api/api";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
  try {
    const res = await api.get("/cart");

    // Normalize possible backend responses
    const data = res.data;
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.cart)
      ? data.cart
      : [];

    setCartItems(items);
    const totalCount = items.reduce((sum, i) => sum + (i.qty || 0), 0);
    setCartCount(totalCount);
  } catch (err) {
    console.error("fetchCart error:", err);
    setCartItems([]);
    setCartCount(0);
  }
};


  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartCount,
        setCartCount,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
