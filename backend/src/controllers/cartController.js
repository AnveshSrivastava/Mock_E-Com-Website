import Product from "../models/Product.js";
import CartItem from "../models/CartItem.js";
import mongoose from "mongoose";

export async function addToCart(req, res, next) {
  try {
    const { productId, qty } = req.body;

    if (!productId || typeof qty !== "number") {
      return res.status(400).json({ error: "Invalid productId or qty" });
    }

    const isStoreReady = await CartItem.validateStore();
    if (!isStoreReady) {
      return res.status(503).json({ error: "Cart storage is unavailable" });
    }
    const product = await Product.findByIdSimple(productId);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    const queryId = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : productId;

    let item = await CartItem.findByProductId(queryId);

    if (item && item.id) {
      const newQty = item.qty + qty;
      if (newQty <= 0) {
        await CartItem.remove(item.id);
        return res.json({ removed: true, id: item.id });
      }
      const updated = await CartItem.update(item.id, { qty: newQty }, item.version);
      return res.json(updated);
    }

    if (qty <= 0) {
      return res
        .status(400)
        .json({ error: "Cannot add item with zero or negative quantity" });
    }

    const created = await CartItem.create({ productId: queryId, qty });
    console.log(
      `[api] POST /api/cart - added new item ${created.id} (productId=${productId}, qty=${qty})`
    );

    return res.status(201).json(created);
  } catch (err) {
    console.error("[api] addToCart error:", err);
    next(err);
  }
}


export async function removeFromCart(req, res, next) {
  try {
    const id = req.params.id;
    const removed = await CartItem.remove(id);
    if (!removed) {
      return res.status(400).json({ error: "Cart item not found" });
    }
    console.log(`[api] DELETE /api/cart/${id} - removed`);
    res.json(removed);
  } catch (err) {
    next(err);
  }
}

export async function getCart(req, res, next) {
  try {
    const items = await CartItem.findAll();
    let total = 0;
    const detailed = await Promise.all(
      items.map(async item => {
        const product = await Product.findByIdSimple(item.productId);
        const price = product ? product.price : 0;
        const lineTotal = price * item.qty;
        total += lineTotal;
        return {
          id: item.id,
          productId: item.productId,
          name: product?.name ?? "Unknown",
          price,
          qty: item.qty,
          lineTotal
        };
      })
    );
    console.log(`[api] GET /api/cart - ${detailed.length} items, total=${total}`);
    res.json({ items: detailed, total });
  } catch (err) {
    next(err);
  }
}
