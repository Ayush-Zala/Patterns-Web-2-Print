import { httpClient } from '../http/http-client';

export const auditApi = {
  getLogs: (params?: any) => httpClient.get<{ data: any[]; meta: any }>('/audit', { ...params }),

  getLog: (id: string) => httpClient.get<any>(`/audit/${id}`),
};
