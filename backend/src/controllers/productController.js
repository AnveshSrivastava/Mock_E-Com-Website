import Product from "../models/Product.js";

/**
 * GET /api/products
 * - If MongoDB connected, fetch from Product collection
 * - Else return in-memory seeded list
 */
export async function getProducts(req, res, next) {
  try {
    const docs = await Product.findAll();
    // Normalize output: { id, name, price }
    const products = docs.map(p => ({ id: p.id, name: p.name, price: p.price }));
    console.log("[api] GET /api/products - returned", products.length, "items");
    res.json(products);
  } catch (err) {
    next(err);
  }
}
