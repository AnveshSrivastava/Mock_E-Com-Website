import request from 'supertest';
import { app } from '../src/app';
import { connectToDatabase, clearDatabase } from '../db/connect';
import Product from '../src/models/Product';

describe('Cart Controller', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    await Product.create({
      id: 'test-product-1',
      name: 'Test Product',
      price: 9.99
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 1
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.productId).toBe('test-product-1');
      expect(res.body.qty).toBe(1);
    });

    it('should update existing cart item quantity', async () => {
      const add = await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 1
        });
      const res = await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 1
        });

      expect(res.status).toBe(200);
      expect(res.body.qty).toBe(2);
    });

    it('should handle invalid product ID', async () => {
      const res = await request(app)
        .post('/api/cart')
        .send({
          productId: 'non-existent',
          qty: 1
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should handle negative quantities', async () => {
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 2
        });
      const res = await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: -3
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/cart', () => {
    it('should return empty cart initially', async () => {
      const res = await request(app).get('/api/cart');

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(0);
      expect(res.body.total).toBe(0);
    });

    it('should return cart with items and total', async () => {
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 2
        });

      const res = await request(app).get('/api/cart');

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].qty).toBe(2);
      expect(res.body.items[0].price).toBe(9.99);
      expect(res.body.total).toBe(19.98);
    });
  });

  describe('DELETE /api/cart/:id', () => {
    it('should remove item from cart', async () => {
      const add = await request(app)
        .post('/api/cart')
        .send({
          productId: 'test-product-1',
          qty: 1
        });

      const res = await request(app)
        .delete(`/api/cart/${add.body.id}`);

      expect(res.status).toBe(200);
      const cart = await request(app).get('/api/cart');
      expect(cart.body.items).toHaveLength(0);
    });

    it('should handle non-existent item ID', async () => {
      const res = await request(app)
        .delete('/api/cart/non-existent');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});