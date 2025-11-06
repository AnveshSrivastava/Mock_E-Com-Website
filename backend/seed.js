// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductModel from "./src/models/Product.js";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
console.log("Mongo URI:", process.env.MONGO_URI);

const products = [
  {
    name: "Vibe Classic T-Shirt",
    price: 499,
    category: "Apparel",
    image: "https://via.placeholder.com/150?text=T-Shirt",
    description: "Soft cotton unisex t-shirt with a comfortable fit.",
  },
  {
    name: "Urban Denim Jeans",
    price: 1299,
    category: "Apparel",
    image: "https://via.placeholder.com/150?text=Jeans",
    description: "Slim-fit denim jeans for everyday wear.",
  },
  {
    name: "Wireless Bluetooth Earbuds",
    price: 1999,
    category: "Electronics",
    image: "https://via.placeholder.com/150?text=Earbuds",
    description: "High-quality sound with noise cancellation and long battery life.",
  },
  {
    name: "Minimalist Wrist Watch",
    price: 1499,
    category: "Accessories",
    image: "https://via.placeholder.com/150?text=Watch",
    description: "Elegant analog wrist watch with stainless steel strap.",
  },
  {
    name: "Smart Fitness Band",
    price: 2499,
    category: "Electronics",
    image: "https://via.placeholder.com/150?text=Fitness+Band",
    description: "Tracks steps, heart rate, and sleep with app sync support.",
  },
  {
    name: "Classic White Sneakers",
    price: 2199,
    category: "Footwear",
    image: "https://via.placeholder.com/150?text=Sneakers",
    description: "Lightweight, durable sneakers perfect for everyday use.",
  },
  {
    name: "Leather Wallet",
    price: 799,
    category: "Accessories",
    image: "https://via.placeholder.com/150?text=Wallet",
    description: "Premium brown leather wallet with multiple compartments.",
  },
  {
    name: "Cotton Hoodie",
    price: 999,
    category: "Apparel",
    image: "https://via.placeholder.com/150?text=Hoodie",
    description: "Soft fleece hoodie with adjustable drawstrings.",
  },
  {
    name: "Aroma Scented Candle",
    price: 349,
    category: "Home Decor",
    image: "https://via.placeholder.com/150?text=Candle",
    description: "Lavender-scented candle that adds calm vibes to your room.",
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 599,
    category: "Lifestyle",
    image: "https://via.placeholder.com/150?text=Bottle",
    description: "Insulated water bottle that keeps drinks hot or cold for hours.",
  },
];

async function seedDatabase() {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("🧹 Clearing existing products...");
    await ProductModel.deleteMany({});

    console.log("🌱 Inserting new products...");
    await ProductModel.insertMany(products);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
