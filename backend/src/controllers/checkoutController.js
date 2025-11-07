import Receipt from "../models/Receipt.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

export async function checkout(req, res, next) {
  try {
    const { cartItems } = req.body;

    let items;
    if (Array.isArray(cartItems)) {
      items = cartItems;
    } else {
      items = await CartItem.findAll();
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cannot checkout with empty cart" });
    }

    let total = 0;
    for (const it of items) {
      const productId = it.productId ?? it.productId;
      const qty = it.qty ?? it.qty;
      const product = await Product.findByIdSimple(productId);
      const price = product ? product.price : 0;
      total += price * qty;
    }

    const receipt = await Receipt.create({ total, timestamp: new Date() });
    console.log(`[api] POST /api/checkout - receipt ${receipt.id} total=${total}`);

    await CartItem.clearAll();
    console.log("[api] POST /api/checkout - cleared cart");

    res.json({
      receiptId: receipt.id,
      total: receipt.total,
      timestamp: receipt.timestamp
    });
  } catch (err) {
    next(err);
  }
}
