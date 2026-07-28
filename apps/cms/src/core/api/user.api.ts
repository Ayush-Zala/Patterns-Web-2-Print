import { httpClient } from '../http/http-client';
import { User } from '@/types/auth.types';

export const userApi = {
  getUsers: (params?: any) => httpClient.get<{ data: User[]; meta: any }>('/users', { ...params }),

  getUser: (id: string) => httpClient.get<User>(`/users/${id}`),

  updateProfile: (data: any) => httpClient.patch<User>('/users/profile', data),

  updateStatus: (id: string, status: string) =>
    httpClient.patch<User>(`/users/${id}/status`, { status }),

  deleteUser: (id: string) => httpClient.delete(`/users/${id}`),

  restoreUser: (id: string) => httpClient.post<User>(`/users/${id}/restore`, {}),

  updateUser: (id: string, data: any) => httpClient.patch<User>(`/users/${id}`, data),
};
