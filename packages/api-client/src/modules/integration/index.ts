import { ApiClient } from '../../client';

export type IntegrationType = 'NATIVE_WEBSITE' | 'WORDPRESS' | 'SHOPIFY';
export type IntegrationStatus = 'ACTIVE' | 'SUSPENDED' | 'DISCONNECTED';

export interface Integration {
  id: string;
  type: IntegrationType;
  displayName: string;
  status: IntegrationStatus;
  configuration: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntegrationPayload {
  type: IntegrationType;
  displayName: string;
}

export interface UpdateIntegrationPayload {
  displayName?: string;
  status?: IntegrationStatus;
}

export interface IntegrationQueryParams {
  type?: IntegrationType;
  status?: IntegrationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IntegrationResponse {
  success: boolean;
  message: string;
  data: Integration;
}

export interface IntegrationListResponse {
  success: boolean;
  message: string;
  data: {
    data: Integration[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class IntegrationApi {
  constructor(private readonly client: ApiClient) {}

  public async findMany(params?: IntegrationQueryParams): Promise<IntegrationListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.type) searchParams.append('type', params.type);
      if (params.status) searchParams.append('status', params.status);
      if (params.search) searchParams.append('search', params.search);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
    }
    const qs = searchParams.toString();
    const query = qs ? `?${qs}` : '';
    return this.client.fetch<IntegrationListResponse>(`/integrations${query}`);
  }

  public async findOne(id: string): Promise<IntegrationResponse> {
    return this.client.fetch<IntegrationResponse>(`/integrations/${id}`);
  }

  public async create(data: CreateIntegrationPayload): Promise<IntegrationResponse> {
    return this.client.fetch<IntegrationResponse>('/integrations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async update(id: string, data: UpdateIntegrationPayload): Promise<IntegrationResponse> {
    return this.client.fetch<IntegrationResponse>(`/integrations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public async remove(id: string): Promise<void> {
    return this.client.fetch<void>(`/integrations/${id}`, {
      method: 'DELETE',
    });
  }
}
