import mongoose from "mongoose";
import { isMongoConnected, inMemoryStore } from "../db/connect.js";

let CartItemModel;

if (isMongoConnected()) {
  const schema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    qty: { type: Number, required: true }
  });

  const MongooseModel = mongoose.models.CartItem || mongoose.model("CartItem", schema);

  CartItemModel = {
    async create(obj) {
      const doc = await MongooseModel.create(obj);
      return { id: doc._id.toString(), productId: doc.productId.toString(), qty: doc.qty };
    },
    async findByProductId(productId) {
      const doc = await MongooseModel.findOne({ productId }).lean();
      return doc ? { id: doc._id.toString(), productId: doc.productId.toString(), qty: doc.qty } : null;
    },
    async update(id, updateObj) {
      const doc = await MongooseModel.findByIdAndUpdate(id, updateObj, { new: true }).lean();
      return doc ? { id: doc._id.toString(), productId: doc.productId.toString(), qty: doc.qty } : null;
    },
    async remove(id) {
      const doc = await MongooseModel.findByIdAndDelete(id).lean();
      return doc ? { id: doc._id.toString(), productId: doc.productId.toString(), qty: doc.qty } : null;
    },
    async findAll() {
      const docs = await MongooseModel.find().lean();
      return docs.map(d => ({ id: d._id.toString(), productId: d.productId.toString(), qty: d.qty }));
    },
    async clearAll() {
      await MongooseModel.deleteMany({});
      return true;
    }
  };
} else {
  const generateId = () => `c${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

  CartItemModel = {
    async create(obj) {
      const id = generateId();
      const rec = { id, productId: obj.productId, qty: obj.qty };
      inMemoryStore.cartItems.push(rec);
      return rec;
    },
    async findByProductId(productId) {
      return inMemoryStore.cartItems.find(ci => ci.productId === productId) ?? null;
    },
    async update(id, updateObj) {
      const idx = inMemoryStore.cartItems.findIndex(ci => ci.id === id);
      if (idx === -1) return null;
      inMemoryStore.cartItems[idx] = { ...inMemoryStore.cartItems[idx], ...updateObj };
      return inMemoryStore.cartItems[idx];
    },
    async remove(id) {
      const idx = inMemoryStore.cartItems.findIndex(ci => ci.id === id);
      if (idx === -1) return null;
      const [removed] = inMemoryStore.cartItems.splice(idx, 1);
      return removed;
    },
    async findAll() {
      return inMemoryStore.cartItems.slice();
    },
    async clearAll() {
      inMemoryStore.cartItems = [];
      return true;
    }
  };
}

export default CartItemModel;