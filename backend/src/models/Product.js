import mongoose from "mongoose";
import { isMongoConnected, inMemoryStore } from "../db/connect.js";

let ProductModel;

if (isMongoConnected()) {
  const schema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
  });

  const MongooseModel = mongoose.models.Product || mongoose.model("Product", schema);

  ProductModel = {
    async findAll() {
      const docs = await MongooseModel.find().lean();
      return docs.map(d => ({ id: d._id.toString(), name: d.name, price: d.price }));
    },
    async findByIdSimple(id) {
      try {
        const doc = await MongooseModel.findById(id).lean();
        return doc ? { id: doc._id.toString(), name: doc.name, price: doc.price } : null;
      } catch {
        return null;
      }
    },
    async insertMany(arr) {
      return MongooseModel.insertMany(arr);
    },
    async countDocuments() {
      return MongooseModel.countDocuments();
    },
    async create(obj) {
      const doc = await MongooseModel.create(obj);
      return { id: doc._id.toString(), name: doc.name, price: doc.price };
    }
  };
} else {
  const generateId = (prefix = "p") =>
    `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

  ProductModel = {
    async findAll() {
      return inMemoryStore.products.map(p => ({ id: p.id, name: p.name, price: p.price }));
    },
    async findByIdSimple(id) {
      const found = inMemoryStore.products.find(p => p.id === id);
      return found ? { id: found.id, name: found.name, price: found.price } : null;
    },
    async insertMany(arr) {
      const inserted = arr.map(a => {
        const id = a.id ?? generateId("p");
        const rec = { id, name: a.name, price: a.price };
        inMemoryStore.products.push(rec);
        return rec;
      });
      return inserted;
    },
    async countDocuments() {
      return inMemoryStore.products.length;
    },
    async create(obj) {
      const id = obj.id ?? generateId("p");
      const rec = { id, name: obj.name, price: obj.price };
      inMemoryStore.products.push(rec);
      return rec;
    }
  };
}

export default ProductModel;
