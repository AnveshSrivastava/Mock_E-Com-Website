import React from "react";

export default function ProductCard({ product, onAddToCart, isAdding }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.name}
        />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">₹{product.price}</p>
      </div>

      <button
        className="add-btn"
        onClick={() => onAddToCart(product._id)}
        disabled={isAdding}
      >
        {isAdding ? "Adding..." : "Add to Cart 🛒"}
      </button>
    </div>
  );
}
