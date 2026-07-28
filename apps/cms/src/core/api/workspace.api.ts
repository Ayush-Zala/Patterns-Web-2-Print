import { httpClient } from '../http/http-client';
import { Workspace } from '@/types/auth.types';

export const workspaceApi = {
  getCurrentWorkspace: () => httpClient.get<Workspace>('/workspace-context/current'),

  getWorkspaces: (params?: { status?: string }) => {
    const query = params?.status ? `?status=${params.status}` : '';
    return httpClient.get<Workspace[]>(`/workspace-context/workspaces${query}`);
  },

  switchWorkspace: (workspaceId: string) =>
    httpClient.patch<Workspace>('/workspace-context/current', { workspaceId }),

  createWorkspace: (data: any) => httpClient.post<Workspace>('/workspaces', data),

  getWorkspace: (id: string) => httpClient.get<Workspace>(`/workspaces/${id}`),

  updateWorkspace: (id: string, data: any) =>
    httpClient.patch<Workspace>(`/workspaces/${id}`, data),

  deleteWorkspace: (id: string) => httpClient.delete(`/workspaces/${id}`),

  restoreWorkspace: (id: string) => httpClient.post<Workspace>(`/workspaces/${id}/restore`, {}),

  updateWorkspaceStatus: (id: string, status: string) =>
    httpClient.patch<Workspace>(`/workspaces/${id}/status`, { status }),
};
