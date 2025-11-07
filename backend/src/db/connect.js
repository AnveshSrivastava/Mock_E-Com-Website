
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const inMemoryStore = {
  products: [],
  cartItems: [],
  receipts: [] 
};

let isConnected = false;

export async function connectToDatabase() {
  const MONGO_URL = process.env.MONGO_URI;
  if (!MONGO_URL) {
    console.log("[db] No MONGO_URL provided — running in in-memory mode.");
    isConnected = false;
    return false;
  }

  try {
    await mongoose.connect(MONGO_URL, {
      autoIndex: true
    });
    isConnected = true;
    console.log("[db] MongoDB connected.");
    return true;
  } catch (err) {
    console.error("[db] MongoDB connection failed — falling back to in-memory mode.", err.message);
    isConnected = false;
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
