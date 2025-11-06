import express from "express";
import * as productController from "./controllers/productController.js";
import * as cartController from "./controllers/cartController.js";
import * as checkoutController from "./controllers/checkoutController.js";

const router = express.Router();

// Products
router.get("/products", productController.getProducts);

// Cart
router.post("/cart", cartController.addToCart);
router.get("/cart", cartController.getCart);
router.delete("/cart/:id", cartController.removeFromCart);

// Checkout
router.post("/checkout", checkoutController.checkout);

export default router;
