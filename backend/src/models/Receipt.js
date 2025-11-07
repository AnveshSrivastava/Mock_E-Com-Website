import mongoose from "mongoose";
import { isMongoConnected, inMemoryStore } from "../db/connect.js"

let ReceiptModel;

if (isMongoConnected()) {
  const schema = new mongoose.Schema({
    total: { type: Number, required: true },
    timestamp: { type: Date, required: true }
  });

  const MongooseModel = mongoose.models.Receipt || mongoose.model("Receipt", schema);

  ReceiptModel = {
    async create(obj) {
      const doc = await MongooseModel.create({ total: obj.total, timestamp: obj.timestamp });
      return { id: doc._id.toString(), total: doc.total, timestamp: doc.timestamp };
    }
  };
} else {
  const generateId = () => `r${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

  ReceiptModel = {
    async create(obj) {
      const id = generateId();
      const rec = {
        id,
        total: obj.total,
        timestamp: obj.timestamp instanceof Date ? obj.timestamp : new Date(obj.timestamp)
      };
      inMemoryStore.receipts.push(rec);
      return rec;
    }
  };
}

export default ReceiptModel;
