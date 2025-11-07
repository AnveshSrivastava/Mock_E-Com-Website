import request from 'supertest';
import { app } from '../src/app';
import { connectToDatabase, clearDatabase } from '../db/connect';
import Product from '../src/models/Product';
import CartItem from '../src/models/CartItem';

describe('Checkout Controller', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    // Seed test product
    await Product.create({
      id: 'test-product-1',
      name: 'Test Product',
      price: 9.99
    });
  });

  describe('POST /api/checkout', () => {
    it('should handle empty cart checkout', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send({ cartItems: [] });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/empty/i);
    });

    it('should process checkout with items', async () => {
      // Add items to cart first
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 2
        });

      const res = await request(app)
        .post('/api/checkout')
        .send({});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('receiptId');
      expect(res.body).toHaveProperty('total', 19.98);
      expect(res.body).toHaveProperty('timestamp');

      // Verify cart is cleared
      const cart = await request(app).get('/api/cart');
      expect(cart.body.items).toHaveLength(0);
    });

    it('should handle concurrent checkouts', async () => {
      // Add items to cart
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 1
        });

      // Start multiple concurrent checkouts
      const checkouts = Array(3).fill().map(() => 
        request(app)
          .post('/api/checkout')
          .send({})
      );

      const results = await Promise.all(checkouts);
      
      // Only first checkout should succeed
      const success = results.filter(r => r.status === 200);
      const failed = results.filter(r => r.status === 400);
      
      expect(success).toHaveLength(1);
      expect(failed).toHaveLength(2);
      
      // Verify cart is cleared
      const cart = await request(app).get('/api/cart');
      expect(cart.body.items).toHaveLength(0);
    });

    it('should validate cart items consistency', async () => {
      // Add item to cart
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 1
        });

      // Try to checkout with modified cart items
      const res = await request(app)
        .post('/api/checkout')
        .send({
          cartItems: [{
            productId: 'test-product-1',
            qty: 100 // Different quantity than in cart
          }]
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/inconsistent/i);
    });
  });
});