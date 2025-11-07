import express from "express";
import * as productController from "./controllers/productController.js";
import * as cartController from "./controllers/cartController.js";
import * as checkoutController from "./controllers/checkoutController.js";

const router = express.Router();
router.get("/products", productController.getProducts);
router.post("/cart", cartController.addToCart);
router.get("/cart", cartController.getCart);
router.delete("/cart/:id", cartController.removeFromCart);
router.post("/checkout", checkoutController.checkout);

export default router;
