// Seed products that will be used if DB is empty or in-memory mode is used.
// Each product has { id, name, price } for in-memory but when seeding Mongo, name & price are used.

export default [
  { id: "p1", name: "Classic Tee", price: 19.99 },
  { id: "p2", name: "Running Sneakers", price: 69.5 },
  { id: "p3", name: "Denim Jacket", price: 89.0 },
  { id: "p4", name: "Sneaky Socks (3 pack)", price: 12.0 },
  { id: "p5", name: "Leather Wallet", price: 39.9 },
  { id: "p6", name: "Wireless Earbuds", price: 129.99 }
];
