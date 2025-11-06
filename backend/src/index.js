import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes.js";
import { connectToDatabase, inMemoryStore } from "./db/connect.js";
import errorHandler from "./middleware/errorHandler.js";
import Product from "./models/Product.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

async function start() {
  try {
    const isMongo = await connectToDatabase();

    console.log(`[server] Starting Mock E-Com Cart on port ${PORT} (MongoDB: ${isMongo ? "connected" : "not connected — using in-memory"})`);

    // If Mongo connected seed products if empty
    if (isMongo) {
      const count = await Product.countDocuments();
      if (count === 0) {
        // dynamic import to avoid cycles
        const seedProducts = (await import("./data/products.js")).default;
        await Product.insertMany(seedProducts.map(p => ({ name: p.name, price: p.price })));
        console.log("[seed] Products collection seeded (MongoDB).");
      } else {
        console.log(`[seed] Products collection exists with ${count} items.`);
      }
    } else {
      // ensure in-memory products seeded
      if (!inMemoryStore.products || inMemoryStore.products.length === 0) {
        const seedProducts = (await import("./data/products.js")).default;
        inMemoryStore.products = seedProducts.map(p => ({ id: p.id, name: p.name, price: p.price }));
        console.log("[seed] Products seeded in in-memory store.");
      }
    }

    app.listen(PORT, () => {
      console.log(`[server] Listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[server] Failed to start:", err);
    process.exit(1);
  }
}

start();
