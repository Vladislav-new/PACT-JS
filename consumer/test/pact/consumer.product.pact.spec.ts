import { Pact, Matchers } from '@pact-foundation/pact';
import path from 'path';
import { ProductClient } from '../../src/modules/frontend/product.client';

const { like } = Matchers;

describe('Consumer Pact: Product API', () => {
  const provider = new Pact({
    consumer: 'FrontendConsumer',
    provider: 'ProductProvider',
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 2,
    logLevel: 'INFO',
    port: 12345
  });

  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  test('GET /products/42 -> 200', async () => {
    await provider.addInteraction({
      state: 'product with id 42 exists',
      uponReceiving: 'a request for product 42',
      withRequest: { method: 'GET', path: '/products/42' },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: like({ id: 42, name: 'Book' })
      }
    });

    const client = new ProductClient();
    // переназначаем базовый URL клиента на mock-провайдера Pact
    (client as any).http.defaults.baseURL = 'http://localhost:12345';
    const product = await client.getById(42);
    expect(product).toEqual({ id: 42, name: 'Book' });
  });

  test('GET /products/404 -> 404', async () => {
    await provider.addInteraction({
      state: 'product with id 404 does not exist',
      uponReceiving: 'a request for product 404',
      withRequest: { method: 'GET', path: '/products/404' },
      willRespondWith: {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }
    });

    const client = new ProductClient();
    (client as any).http.defaults.baseURL = 'http://localhost:12345';
    await expect(client.getById(404)).rejects.toBeTruthy();
  });

  test('POST /products -> 201', async () => {
    await provider.addInteraction({
      state: 'can create product',
      uponReceiving: 'a request to create product',
      withRequest: {
        method: 'POST',
        path: '/products',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: like({ id: 7, name: 'Pen' })
      },
      willRespondWith: {
        status: 201,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: like({ id: 7, name: 'Pen' })
      }
    });

    const client = new ProductClient();
    (client as any).http.defaults.baseURL = 'http://localhost:12345';
    const res = await (client as any).http.post('/products', { id: 7, name: 'Pen' });
    expect(res.data).toEqual({ id: 7, name: 'Pen' });
  });
});


