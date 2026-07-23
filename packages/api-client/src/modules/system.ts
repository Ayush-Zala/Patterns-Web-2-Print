import type { ApiClient } from '../client';

export class SystemApi {
  constructor(private readonly client: ApiClient) {}

  public async getHealth() {
    return this.client.fetch('/api/v1/system/health');
  }

  public async getInfo() {
    return this.client.fetch('/api/v1/system/info');
  }
}
