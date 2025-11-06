"# Mock E-Commerce Cart Application

A full-stack shopping cart application built with React (Vite) and Node.js/Express, featuring product listing, cart management, and mock checkout functionality.

## 🚀 Features

- Product listing with add to cart functionality
- Cart management (add, remove, update quantity)
- Mock checkout process with receipt generation
- Responsive design with Tailwind CSS and Framer Motion animations
- REST API backend with MongoDB/In-memory storage
- Optimistic concurrency control for cart operations
- Comprehensive error handling and recovery
- Unit and integration tests

## 📋 Prerequisites

- Node.js >= 14.x
- npm >= 6.x
- MongoDB (optional)

## 🛠️ Installation

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
PORT=3000
MONGO_URL=mongodb://localhost:27017/mock-ecom (optional)

# Run tests
npm test

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file with:
VITE_API_URL=http://localhost:3000

# Start development server
npm run dev
```

## 🔌 API Documentation

### Products API

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

### Cart API

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

### Checkout API

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

## 🧪 Testing

The project includes comprehensive test coverage for both backend and frontend:

### Backend Tests
- Unit tests for models
- Integration tests for API endpoints
- Concurrency testing for cart operations
- Edge case handling tests

Run tests with:
```bash
cd backend
npm test
```

### Frontend Tests
- Component testing with React Testing Library
- API integration tests
- UI interaction tests

Run tests with:
```bash
cd frontend
npm test
```

## 🔒 Error Handling

The application implements comprehensive error handling:

1. API Errors:
   - Input validation
   - Product availability checks
   - Quantity validation
   - Network error recovery
   - Concurrency control

2. Frontend Error Handling:
   - API error toasts
   - Loading states
   - Network error recovery
   - Form validation

## 💾 Data Persistence

The application supports two storage modes:

1. MongoDB (Recommended):
   - Set MONGO_URL in backend .env
   - Persistent across server restarts
   - Optimistic concurrency control
   - Atomic operations

2. In-Memory (Fallback):
   - Automatic fallback if MongoDB unavailable
   - Data persists until server restart
   - Simulated concurrency control
   - Suitable for development/testing

## 🏗️ Project Structure

```
/mock-ecom-cart
├── /backend
│   ├── /src
│   │   ├── /controllers    # Request handlers
│   │   ├── /models         # Data models
│   │   ├── /middleware     # Express middleware
│   │   └── /db            # Database connection
│   └── /tests              # Backend tests
├── /frontend
│   ├── /src
│   │   ├── /api           # API client
│   │   ├── /components    # React components
│   │   ├── /pages         # Route pages
│   │   └── /utils         # Helper functions
│   └── /tests             # Frontend tests
```

## 🔄 State Management

- Server: MongoDB/In-memory store with optimistic concurrency
- Frontend: React Context for cart state
- API: RESTful endpoints with proper error handling

## 🚦 Known Limitations

1. No user authentication/sessions
2. In-memory mode loses data on server restart
3. No real payment processing
4. Limited product metadata

## 🛣️ Future Improvements

1. User authentication
2. Session persistence
3. Real payment integration
4. Product categories and search
5. Order history
6. E2E testing with Cypress" 
