import { httpClient } from '../http/http-client';
export interface IntegrationQueryParams {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
export interface IntegrationListResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface IntegrationResponse {
  data: any;
}
export interface CreateIntegrationPayload {
  type: string;
  displayName: string;
}
export interface UpdateIntegrationPayload {
  displayName?: string;
  status?: string;
}

export const integrationApi = {
  findMany: (workspaceId: string, params?: IntegrationQueryParams) => {
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
    return httpClient.get<IntegrationListResponse>(`/integrations${query}`, {
      headers: { 'x-workspace-id': workspaceId },
    });
  },
  findOne: (workspaceId: string, id: string) =>
    httpClient.get<IntegrationResponse>(`/integrations/${id}`, {
      headers: { 'x-workspace-id': workspaceId },
    }),
  create: (workspaceId: string, data: CreateIntegrationPayload) =>
    httpClient.post<IntegrationResponse>('/integrations', data, {
      headers: { 'x-workspace-id': workspaceId },
    }),
  update: (workspaceId: string, id: string, data: UpdateIntegrationPayload) =>
    httpClient.patch<IntegrationResponse>(`/integrations/${id}`, data, {
      headers: { 'x-workspace-id': workspaceId },
    }),
  remove: (workspaceId: string, id: string) =>
    httpClient.delete(`/integrations/${id}`, {
      headers: { 'x-workspace-id': workspaceId },
    }),
  connectShopify: (workspaceId: string, data: { shop: string; redirectUri: string }) =>
    httpClient.post<{ redirectUrl: string }>('/integrations/shopify/connect', data, {
      headers: { 'x-workspace-id': workspaceId },
    }),
};
