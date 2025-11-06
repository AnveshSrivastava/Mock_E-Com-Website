import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import "../styles.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      // Backend returns an array
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load products:", err);
      alert("⚠️ Failed to load products. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post("/cart", { productId, qty: 1 });
      alert("✅ Item added to cart!");
      fetchCart();
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("❌ Failed to add item to cart.");
    }
  };

  if (loading) return <p className="center">Loading products...</p>;
  if (products.length === 0) return <p className="center">No products available yet.</p>;

  return (
    <div className="container">
      <h2>Discover Our Products</h2>
      <div className="grid">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={() => handleAddToCart(p.id)}
          />
        ))}
      </div>
    </div>
  );
}
