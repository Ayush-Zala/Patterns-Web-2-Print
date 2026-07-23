import type { ApiClient } from '../client';

export class WorkspaceApi {
  constructor(private readonly client: ApiClient) {}

  // Placeholders
  public async getWorkspace() {
    return this.client.fetch('/api/v1/workspace');
  }
}
