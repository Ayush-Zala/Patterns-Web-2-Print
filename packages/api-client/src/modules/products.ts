import type { ApiClient } from '../client';

export class ProductsApi {
  constructor(private readonly client: ApiClient) {}

  // Placeholders
  public async listProducts() {
    return this.client.fetch('/api/v1/products');
  }
}
