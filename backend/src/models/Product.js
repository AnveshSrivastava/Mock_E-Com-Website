import mongoose from "mongoose";
import { isMongoConnected, inMemoryStore } from "../db/connect.js";

let MongooseModel = null;

// Create schema once for re-use
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

function getMongooseModel() {
  if (!MongooseModel) {
    MongooseModel = mongoose.models.Product || mongoose.model("Product", schema);
  }
  return MongooseModel;
}

const ProductModel = {
  async findAll() {
    const model = getMongooseModel();
    try {
      const docs = await model.find().lean();
      return docs.map(d => ({ id: d._1?._id?.toString ? d._id.toString() : d._id, name: d.name, price: d.price }));
    } catch (err) {
      return inMemoryStore.products.map(p => ({ id: p.id, name: p.name, price: p.price }));
    }
  },

  async findByIdSimple(id) {
    const model = getMongooseModel();
    try {
      const doc = await model.findById(id).lean();
      return doc ? { id: doc._id.toString(), name: doc.name, price: doc.price } : null;
    } catch (err) {
      const found = inMemoryStore.products.find(p => p.id === id);
      return found ? { id: found.id, name: found.name, price: found.price } : null;
    }
  },

  async insertMany(arr) {
    const model = getMongooseModel();
    try {
      const docs = await model.insertMany(arr);
      return docs.map(d => ({ id: d._id.toString(), name: d.name, price: d.price }));
    } catch (err) {
      const inserted = arr.map(a => ({
        id: `p${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`,
        ...a
      }));
      inMemoryStore.products.push(...inserted);
      return inserted;
    }
  },

  async countDocuments() {
    const model = getMongooseModel();
    try {
      return await model.countDocuments();
    } catch (err) {
      return inMemoryStore.products.length;
    }
  },

  async create(obj) {
    const model = getMongooseModel();
    try {
      const doc = await model.create(obj);
      return { id: doc._id.toString(), name: doc.name, price: doc.price };
    } catch (err) {
      const id = `p${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
      const rec = { id, name: obj.name, price: obj.price };
      inMemoryStore.products.push(rec);
      return rec;
    }
  },

  async deleteMany() {
    const model = getMongooseModel();
    try {
      await model.deleteMany({});
      return true;
    } catch (err) {
      inMemoryStore.products = [];
      return true;
    }
  }
};

export default ProductModel;
