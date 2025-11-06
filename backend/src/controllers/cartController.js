import Product from "../models/Product.js";
import CartItem from "../models/CartItem.js";

/**
 * POST /api/cart
 * body: { productId, qty }
 */
export async function addToCart(req, res, next) {
  try {
    const { productId, qty } = req.body;
    if (!productId || typeof qty !== "number") {
      return res.status(400).json({ error: "Invalid productId or qty" });
    }

    // Validate persistence
    const isStoreReady = await CartItem.validateStore();
    if (!isStoreReady) {
      return res.status(503).json({ error: "Cart storage is unavailable" });
    }

    // Validate product exists
    const product = await Product.findByIdSimple(productId);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    // If exists update, else create
    let item = await CartItem.findByProductId(productId);
    if (item) {
      const newQty = item.qty + qty;
      // Don't allow negative quantities
      if (newQty <= 0) {
        // If quantity would be 0 or negative, remove the item
        await CartItem.remove(item.id);
        console.log(`[api] POST /api/cart - removed item ${item.id} due to zero/negative qty`);
        return res.json({ removed: true, id: item.id });
      }
      
      item = await CartItem.update(item.id, { qty: newQty });
      console.log(`[api] POST /api/cart - updated cart item ${item.id} qty=${item.qty}`);
      return res.json(item);
    } else {
      if (qty <= 0) {
        return res.status(400).json({ error: "Cannot add item with zero or negative quantity" });
      }
      const created = await CartItem.create({ productId, qty });
      console.log(`[api] POST /api/cart - added cart item ${created.id} productId=${productId} qty=${qty}`);
      return res.status(201).json(created);
    }
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cart/:id
 */
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

/**
 * GET /api/cart
 * Returns { items: [...], total }
 */
export async function getCart(req, res, next) {
  try {
    const items = await CartItem.findAll();
    // populate product info and compute total
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
