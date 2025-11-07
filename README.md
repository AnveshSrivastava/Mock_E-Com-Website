## 🛒 Mock E‑Com Cart

Clean, full‑stack shopping cart demo built for Vibe Commerce screening. It showcases a minimal but production‑style implementation of product listing, cart management, and a mock checkout flow with a React frontend and a Node.js/Express backend. Data persists via MongoDB with an automatic in‑memory fallback.

### Live Preview / Screenshots
- Homepage (Product Grid): `./screenshots/products.png`
- Cart Page: `./screenshots/cart.png`
- Checkout Receipt: `./screenshots/receipt.png`

---

## ✨ Key Features
- **Product catalog**: Responsive grid with “Add to Cart”
- **Cart management**: Add/remove items, quantity +/- controls, total calculation
- **Mock checkout**: Simple form (name, email) and receipt modal (id, total, timestamp)
- **State management**: React Context for global cart state
- **API design**: Clean REST endpoints with validation and error handling
- **Persistence**: MongoDB (via Mongoose) with transparent in‑memory fallback
- **Polish**: Toast feedback, smooth UI transitions, type‑safe data flows

## 🧰 Tech Stack
- **Frontend**: React, Vite, Axios, Tailwind CSS, Shadcn/UI, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), dotenv, Nodemon
- **Tooling**: concurrently, ESLint, Git + GitHub

## 🧱 Project Structure
```
mock-ecom-cart/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── db/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│   └── package.json
├── README.md
└── .env.example
```

## 🧩 Architecture Overview
- **Frontend** (React): Fetches products and cart data from the backend. Uses Context to manage cart state and synchronize with APIs. Optimistic UI updates with error recovery.
- **Backend** (Express): Exposes product, cart, and checkout endpoints. Validates inputs, manages concurrency and totals, and issues a mock receipt.
- **Persistence**: Mongoose models backed by MongoDB. If MongoDB is unavailable, an in‑memory store is used for development/demo without changing the API surface.

## 🔌 Backend APIs
- `GET /api/products` → List of products `{ id, name, price }`
- `GET /api/cart` → Current items and computed totals
- `POST /api/cart` → Add/update item `{ productId, qty }`
- `DELETE /api/cart/:id` → Remove an item from cart
- `POST /api/checkout` → Process mock checkout, returns receipt `{ receiptId, total, timestamp }`

Example requests:

```bash
# List products
curl http://localhost:4000/api/products

# Add an item to cart
curl -X POST http://localhost:4000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId":"<productId>","qty":2}'

# Get cart
curl http://localhost:4000/api/cart

# Remove item from cart
curl -X DELETE http://localhost:4000/api/cart/<cartItemId>

# Checkout
curl -X POST http://localhost:4000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"cartItems":[{"productId":"<productId>","qty":2}]}'
```

## 🎨 Frontend Features
- Responsive product grid with accessible “Add to Cart” buttons
- Cart page with quantity controls, removal, line totals, and grand total
- Checkout form (name, email) that triggers a receipt modal
- Toast notifications and animated transitions (Framer Motion)
- Context API for reliable global cart state

## ⚙️ Setup (Local Development)
1) Clone the repository

```bash
git clone https://github.com/<username>/mock-ecom-cart.git
cd mock-ecom-cart
```

2) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

3) Configure environment variables (backend)

Create a `.env` file inside `backend/` (or copy `.env.example`):

```bash
MONGO_URI=mongodb+srv://<your_connection_string>
PORT=4000
```

4) Run backend and frontend together

```bash
npm run dev
```

Visit the frontend at `http://localhost:3000` and the API at `http://localhost:4000/api/products`.

## 💾 Data & Utilities
- **In‑memory fallback**: If MongoDB is not connected, the backend uses an in‑memory store (non‑persistent; resets on restart).
- **Seed script**: Populate sample products via `backend/src/db/seed.js`.
- **Logging & errors**: Consistent validation and error responses across the backend; console logs for development insight.

## 🧪 Testing Endpoints (Optional)
You can quickly verify APIs with Postman/Insomnia or cURL (see examples above). Suggested environment base URL: `http://localhost:4000`.

## 💡 Future Improvements
- Authentication & sessions
- Product categories, search, and filters
- Real payment gateway integration
- Order history and receipts list
- Admin dashboard for products and inventory
- E2E tests (Cypress) and CI/CD workflows

## 👨‍💻 Author
**Anvesh Srivastava**  
[GitHub @AnveshSrivastava](https://github.com/AnveshSrivastava) · [LinkedIn: Anvesh Srivastava](https://linkedin.com/in/anveshsrivastava)

## 📄 License
This project is open‑source under the [MIT License](LICENSE).
