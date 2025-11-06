import axios from "axios";

// Vite environment variable syntax
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- API Calls ---
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (productId, qty = 1) => {
  try {
    const response = await api.post("/cart", { productId, qty });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const checkout = async (cartItems) => {
  try {
    const response = await api.post("/checkout", { cartItems });
    return response.data;
  } catch (error) {
    console.error("Error during checkout:", error);
    throw error;
  }
};

export default api;
