# Mock E-Com Cart Backend

Express.js backend for the Mock E-Com Cart application. Features MongoDB integration with in-memory fallback, RESTful APIs, and robust error handling.

## Features

- RESTful API endpoints
- MongoDB integration with Mongoose
- In-memory fallback store
- MVC architecture
- Comprehensive error handling
- Request validation
- Optimistic concurrency control

## Tech Stack

- **Node.js** - Runtime
- **Express** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **dotenv** - Environment Variables
- **cors** - CORS Support

## API Documentation

### Products

#### GET /api/products
Returns list of available products.

Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "price": "number"
  }
]
```

### Cart

#### GET /api/cart
Returns current cart items and total.

Response:
```json
{
  "items": [
    {
      "id": "string",
      "productId": "string",
      "name": "string",
      "price": "number",
      "qty": "number",
      "lineTotal": "number"
    }
  ],
  "total": "number"
}
```

#### POST /api/cart
Add/update cart item.

Request:
```json
{
  "productId": "string",
  "qty": "number"
}
```

#### DELETE /api/cart/:id
Remove item from cart.

### Checkout

#### POST /api/checkout
Process checkout and generate receipt.

Request:
```json
{
  "cartItems": [
    {
      "productId": "string",
      "qty": "number"
    }
  ]
}
```

Response:
```json
{
  "receiptId": "string",
  "total": "number",
  "timestamp": "string"
}
```

## Development

### Prerequisites
- Node.js >= 14.x
- npm >= 6.x
- MongoDB (optional)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/mock-ecom
   PORT=4000
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Testing

Run the test suite:
```bash
npm test
```

## Architecture

```
src/
├── controllers/   # Request handlers
├── models/       # Data models & business logic
├── middleware/   # Express middleware
├── routes/       # API routes
├── db/          # Database config
└── index.js     # Entry point
```

## Error Handling

The backend implements comprehensive error handling:

1. Request Validation
   - Input validation
   - Type checking
   - Required fields

2. Database Operations
   - Connection errors
   - Query failures
   - Concurrent updates

3. Business Logic
   - Cart consistency
   - Product availability
   - Quantity validation

## Data Persistence

The application supports two storage modes:

1. MongoDB (Recommended)
   - Set MONGO_URI in .env
   - Persistent across restarts
   - Concurrent request handling

2. In-Memory (Fallback)
   - Automatic fallback if MongoDB unavailable
   - Data persists until server restart
   - Suitable for development/testing