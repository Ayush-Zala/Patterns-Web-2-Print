import type { ApiClient } from '../client';

export class TemplateApi {
  constructor(private readonly client: ApiClient) {}

  // Placeholders
  public async listTemplates() {
    return this.client.fetch('/api/v1/templates');
  }
}
