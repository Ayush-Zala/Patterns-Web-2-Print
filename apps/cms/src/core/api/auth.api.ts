import { httpClient } from '../http/http-client';
import { ApiResponse, LoginResponse, User } from '@/types/auth.types';

export const authApi = {
  login: (data: { email: string; password?: string; rememberMe?: boolean }) =>
    httpClient.post<LoginResponse>('/auth/login', data, { skipAuth: true }),

  refresh: () => httpClient.post<{ accessToken: string }>('/auth/refresh', {}, { skipAuth: true }),

  logout: (allDevices: boolean = false) => httpClient.post('/auth/logout', { allDevices }),

  getMe: () => httpClient.get<{ user: User }>('/auth/me'),

  forgotPassword: (email: string) =>
    httpClient.post('/auth/forgot-password', { email }, { skipAuth: true }),

  resetPassword: (data: { token: string; password?: string }) =>
    httpClient.post('/auth/reset-password', data, { skipAuth: true }),

  changePassword: (data: { currentPassword?: string; newPassword?: string }) =>
    httpClient.post('/auth/change-password', data),
};
