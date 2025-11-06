import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import '../styles.css'
export default function Navbar() {
  const cartCount = useContext(CartContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo / Title */}
        <Link to="/" className="nav-title">
          🛍️ Mock E-Com Cart
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
          >
            Products
          </Link>

          <Link
            to="/cart"
            className={isActive("/cart") ? "active" : ""}
          >
            Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
