import mongoose from "mongoose";
import { inMemoryStore } from "../db/connect.js";

// Define schema and mongoose model eagerly. It's safe to
// create the model before a connection is established — the
// model will be ready once mongoose connects.
const schema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
  qty: { type: Number, required: true },
  version: { type: Number, default: 0 }
});

const MongooseModel = mongoose.models.CartItem || mongoose.model("CartItem", schema);

// Helper: generate in-memory id
const generateId = () => `c${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

const CartItemModel = {
  async validateStore() {
    try {
      // if mongoose has an active connection, ping DB
      if (mongoose.connection && mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        return true;
      }
    } catch (err) {
      return false;
    }
    // if no mongoose DB available, still consider in-memory valid
    return true;
  },

  async create(obj) {
    try {
      const doc = await MongooseModel.create(obj);
      return { id: doc._id.toString(), productId: doc.productId.toString(), qty: doc.qty, version: doc.version };
    } catch (err) {
      const id = generateId();
      const rec = { id, productId: obj.productId, qty: obj.qty, version: 0 };
      inMemoryStore.cartItems.push(rec);
      return rec;
    }
  },

  async findByProductId(productId) {
  try {
    const queryId = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : productId;

    const doc = await MongooseModel.findOne({ productId: queryId }).lean();
    return doc
      ? {
          id: doc._id.toString(),
          productId: doc.productId.toString(),
          qty: doc.qty,
          version: doc.version,
        }
      : null;
  } catch (err) {
    console.warn("[CartItem.findByProductId] Falling back to in-memory:", err.message);
    return inMemoryStore.cartItems.find((ci) => ci.productId === productId) ?? null;
  }
}

,

  async update(id, updateObj, version) {
    try {
      // optimistic locking: match provided version
      const doc = await MongooseModel.findOneAndUpdate(
        { _id: id, version },
        { ...updateObj, $inc: { version: 1 } },
        { new: true }
      ).lean();

      if (!doc) {
        throw new Error('Concurrent update detected');
      }
      return { id: doc._id.toString(), productId: doc.productId.toString(), qty: doc.qty, version: doc.version };
    } catch (err) {
      // fallback to in-memory
      const idx = inMemoryStore.cartItems.findIndex(ci => ci.id === id);
      if (idx === -1) return null;
      if (inMemoryStore.cartItems[idx].version !== version) {
        throw new Error('Concurrent update detected');
      }
      inMemoryStore.cartItems[idx] = { ...inMemoryStore.cartItems[idx], ...updateObj, version: version + 1 };
      return inMemoryStore.cartItems[idx];
    }
  },

  async remove(id) {
    try {
      const doc = await MongooseModel.findByIdAndDelete(id).lean();
      return doc ? { id: doc._id.toString(), productId: doc.productId.toString(), qty: doc.qty, version: doc.version } : null;
    } catch (err) {
      const idx = inMemoryStore.cartItems.findIndex(ci => ci.id === id);
      if (idx === -1) return null;
      const [removed] = inMemoryStore.cartItems.splice(idx, 1);
      return removed;
    }
  },

  async findAll() {
    try {
      const docs = await MongooseModel.find().lean();
      return docs.map(d => ({ id: d._id.toString(), productId: d.productId.toString(), qty: d.qty, version: d.version }));
    } catch (err) {
      return inMemoryStore.cartItems.slice();
    }
  },

  async clearAll() {
    try {
      await MongooseModel.deleteMany({});
      return true;
    } catch (err) {
      inMemoryStore.cartItems = [];
      return true;
    }
  }
};

export default CartItemModel;