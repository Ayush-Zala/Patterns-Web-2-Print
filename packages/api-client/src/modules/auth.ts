import type { ApiClient } from '../client';

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  // Placeholders
  public async me() {
    return this.client.fetch('/api/v1/auth/me');
  }
}
