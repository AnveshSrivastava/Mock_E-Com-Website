import mongoose from "mongoose";
import { isMongoConnected, inMemoryStore } from "../db/connect.js";

let CartItemModel;

if (isMongoConnected()) {
  const schema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    qty: { type: Number, required: true },
    version: { type: Number, default: 0 } // For optimistic locking
  });

  // Handle concurrent updates with optimistic locking
  schema.pre('save', async function(next) {
    if (this.isNew) {
      this.version = 0;
    } else {
      this.version += 1;
    }
    next();
  });

  const MongooseModel = mongoose.models.CartItem || mongoose.model("CartItem", schema);

  CartItemModel = {
    async validateStore() {
      try {
        await mongoose.connection.db.admin().ping();
        return true;
      } catch {
        return false;
      }
    },
    async create(obj) {
      const doc = await MongooseModel.create(obj);
      return { 
        id: doc._id.toString(), 
        productId: doc.productId.toString(), 
        qty: doc.qty,
        version: doc.version 
      };
    },
    async findByProductId(productId) {
      const doc = await MongooseModel.findOne({ productId }).lean();
      return doc ? { 
        id: doc._id.toString(), 
        productId: doc.productId.toString(), 
        qty: doc.qty,
        version: doc.version 
      } : null;
    },
    async update(id, updateObj, version) {
      // Use optimistic locking for concurrent updates
      const doc = await MongooseModel.findOneAndUpdate(
        { _id: id, version }, 
        { ...updateObj, $inc: { version: 1 } },
        { new: true }
      ).lean();
      
      if (!doc) {
        throw new Error('Concurrent update detected');
      }
      
      return { 
        id: doc._id.toString(), 
        productId: doc.productId.toString(), 
        qty: doc.qty,
        version: doc.version 
      };
    },
    async remove(id) {
      const doc = await MongooseModel.findByIdAndDelete(id).lean();
      return doc ? { 
        id: doc._id.toString(), 
        productId: doc.productId.toString(), 
        qty: doc.qty,
        version: doc.version 
      } : null;
    },
    async findAll() {
      const docs = await MongooseModel.find().lean();
      return docs.map(d => ({ 
        id: d._id.toString(), 
        productId: d.productId.toString(), 
        qty: d.qty,
        version: d.version 
      }));
    },
    async clearAll() {
      await MongooseModel.deleteMany({});
      return true;
    }
  };
} else {
  // In-memory store with versioning
  const generateId = () => `c${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

  CartItemModel = {
    async validateStore() {
      return true; // In-memory store is always valid
    },
    async create(obj) {
      const id = generateId();
      const rec = { 
        id, 
        productId: obj.productId, 
        qty: obj.qty,
        version: 0 
      };
      inMemoryStore.cartItems.push(rec);
      return rec;
    },
    async findByProductId(productId) {
      return inMemoryStore.cartItems.find(ci => ci.productId === productId) ?? null;
    },
    async update(id, updateObj, version) {
      const idx = inMemoryStore.cartItems.findIndex(ci => ci.id === id);
      if (idx === -1) return null;
      
      // Check version for concurrent updates
      if (inMemoryStore.cartItems[idx].version !== version) {
        throw new Error('Concurrent update detected');
      }
      
      inMemoryStore.cartItems[idx] = { 
        ...inMemoryStore.cartItems[idx], 
        ...updateObj,
        version: version + 1 
      };
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