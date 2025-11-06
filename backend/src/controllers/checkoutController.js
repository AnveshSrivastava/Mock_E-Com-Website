import Receipt from "../models/Receipt.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

/**
 * POST /api/checkout
 * body: { cartItems }  (optional — if not provided, use server-side cart)
 *
 * We compute total, create a mock receipt { receiptId, total, timestamp }, store it (if DB), clear cart, and return receipt.
 */
export async function checkout(req, res, next) {
  try {
    const { cartItems } = req.body;

    // Use provided cartItems or server-side stored cart
    let items;
    if (Array.isArray(cartItems)) {
      items = cartItems;
    } else {
      items = await CartItem.findAll();
    }

    // Check for empty cart
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cannot checkout with empty cart" });
    }

    // Compute total using product prices
    let total = 0;
    // cartItems items in two possible formats:
    // - if server-side: items are objects with id, productId, qty
    // - if client-sent: items should be { productId, qty }
    for (const it of items) {
      const productId = it.productId ?? it.productId;
      const qty = it.qty ?? it.qty;
      const product = await Product.findByIdSimple(productId);
      const price = product ? product.price : 0;
      total += price * qty;
    }

    const receipt = await Receipt.create({ total, timestamp: new Date() });
    console.log(`[api] POST /api/checkout - receipt ${receipt.id} total=${total}`);

    // Clear server-side cart
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
