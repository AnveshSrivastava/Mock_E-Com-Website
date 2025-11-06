import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { CartContext } from "../context/CartContext";
import ReceiptModal from "../components/ReceiptModal";
import "../styles.css";

export default function Cart() {
  const { fetchCart } = useContext(CartContext);
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      const items = res.data.items || [];
      setCartData(items);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      await loadCart();
      fetchCart();
      alert("Item removed from cart!");
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleQtyChange = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.post("/cart", { productId, qty: newQty });
      await loadCart();
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      const res = await api.post("/checkout", {
        name: formData.name,
        email: formData.email,
        cartItems: cartData,
      });

      setReceipt(res.data.receipt);
      setShowReceipt(true);
      setFormData({ name: "", email: "" });
      setCartData([]);
      fetchCart();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed.");
    }
  };

  if (loading) return <p className="center">Loading your cart...</p>;
  if (cartData.length === 0) return <p className="center">🛒 Your cart is empty!</p>;

  return (
    <div className="container">
      <h2>Your Cart</h2>

      {cartData.map((item) => (
        <div key={item.id} className="cart-item">
          <span className="item-name">{item.name}</span>
          <div className="qty-controls">
            <button onClick={() => handleQtyChange(item.productId, item.qty - 1)}>−</button>
            <input
              type="number"
              value={item.qty}
              min="1"
              onChange={(e) => handleQtyChange(item.productId, parseInt(e.target.value))}
            />
            <button onClick={() => handleQtyChange(item.productId, item.qty + 1)}>+</button>
          </div>
          <span>₹{item.price * item.qty}</span>
          <button onClick={() => handleRemove(item.id)}>🗑</button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <form onSubmit={handleCheckout} className="checkout-form">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <button type="submit">Checkout</button>
      </form>

      {showReceipt && <ReceiptModal receipt={receipt} onClose={() => setShowReceipt(false)} />}
    </div>
  );
}
