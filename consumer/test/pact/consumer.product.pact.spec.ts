// @ts-nocheck
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';
import { ProductClient } from '../../src/modules/frontend/product.client';

const { like } = MatchersV3;

describe('Consumer Pact: Product API', () => {
  const provider = new PactV3({
    consumer: 'FrontendConsumer',
    provider: 'ProductProvider',
    logLevel: 'info',
    dir: path.resolve(process.cwd(), 'pacts')
  });

  test('GET /products/42 -> 200', async () => {
    provider
      .given('product with id 42 exists')
      .uponReceiving('a request for product 42')
      .withRequest({ method: 'GET', path: '/products/42' })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: like({ id: 42, name: 'Book' })
      });

    await provider.executeTest(async (mockServer) => {
      const client = new ProductClient(mockServer.url);
      const product = await client.getById(42);
      expect(product).toEqual({ id: 42, name: 'Book' });
    });
  });

  test('GET /products/404 -> 404', async () => {
    provider
      .given('product with id 404 does not exist')
      .uponReceiving('a request for product 404')
      .withRequest({ method: 'GET', path: '/products/404' })
      .willRespondWith({ status: 404 });

    await provider.executeTest(async (mockServer) => {
      const client = new ProductClient(mockServer.url);
      await expect(client.getById(404)).rejects.toBeTruthy();
    });
  });

  test('POST /products -> 201', async () => {
    provider
      .given('can create product')
      .uponReceiving('a request to create product')
      .withRequest({
        method: 'POST',
        path: '/products',
        headers: { 'Content-Type': 'application/json' },
        body: like({ id: 7, name: 'Pen' })
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: like({ id: 7, name: 'Pen' })
      });

    await provider.executeTest(async (mockServer) => {
      const client = new ProductClient(mockServer.url);
      const res = await (client as any).http.post('/products', { id: 7, name: 'Pen' });
      expect(res.data).toEqual({ id: 7, name: 'Pen' });
    });
  });

  test('POST /products -> 400 invalid body', async () => {
    provider
      .given('validation enforced')
      .uponReceiving('a request to create product with invalid body')
      .withRequest({
        method: 'POST',
        path: '/products',
        headers: { 'Content-Type': 'application/json' },
        body: like({ wrong: 'payload' })
      })
      .willRespondWith({ status: 400 });

    await provider.executeTest(async (mockServer) => {
      const client = new ProductClient(mockServer.url);
      await expect((client as any).http.post('/products', { wrong: 'payload' })).rejects.toBeTruthy();
    });
  });

  test('POST /products -> 409 conflict', async () => {
    provider
      .given('product with id 42 exists')
      .uponReceiving('a request to create existing product')
      .withRequest({
        method: 'POST',
        path: '/products',
        headers: { 'Content-Type': 'application/json' },
        body: like({ id: 42, name: 'Book' })
      })
      .willRespondWith({ status: 409 });

    await provider.executeTest(async (mockServer) => {
      const client = new ProductClient(mockServer.url);
      await expect((client as any).http.post('/products', { id: 42, name: 'Book' })).rejects.toBeTruthy();
    });
  });
});


