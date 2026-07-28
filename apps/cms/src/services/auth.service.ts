import { authApi } from '@/core/api/auth.api';
import { httpClient } from '@/core/http/http-client';
import { handleApiError } from '@/core/http/error-handler';

export const authService = {
  login: async (email: string, password?: string, rememberMe: boolean = false) => {
    try {
      const payload: { email: string; password?: string; rememberMe?: boolean } = {
        email,
        rememberMe,
      };
      if (password !== undefined) {
        payload.password = password;
      }
      const response = await authApi.login(payload);
      const data = response.data;
      if (data?.accessToken) {
        httpClient.setAccessToken(data.accessToken);
      }
      return data;
    } catch (error) {
      throw handleApiError(error, 'Login Failed');
    }
  },

  refreshSession: async () => {
    try {
      const response = await authApi.refresh();
      const accessToken = response.data?.accessToken;
      if (accessToken) {
        httpClient.setAccessToken(accessToken);
        return accessToken;
      }
      return null;
    } catch {
      httpClient.setAccessToken(null);
      return null;
    }
  },

  logout: async (allDevices: boolean = false) => {
    try {
      await authApi.logout(allDevices);
    } catch {
      // Ignore logout API failures and clear token regardless
    } finally {
      httpClient.setAccessToken(null);
    }
  },

  getMe: async () => {
    try {
      const response = await authApi.getMe();
      return response.data?.user || (response.data as any);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  forgotPassword: async (email: string) => {
    try {
      await authApi.forgotPassword(email);
    } catch (error) {
      // Ignore error details to prevent email enumeration
    }
  },

  resetPassword: async (token: string, password?: string) => {
    try {
      const payload: { token: string; password?: string } = { token };
      if (password !== undefined) {
        payload.password = password;
      }
      await authApi.resetPassword(payload);
    } catch (error) {
      throw handleApiError(error, 'Reset Password Failed');
    }
  },

  changePassword: async (currentPassword?: string, newPassword?: string) => {
    try {
      const payload: { currentPassword?: string; newPassword?: string } = {};
      if (currentPassword !== undefined) payload.currentPassword = currentPassword;
      if (newPassword !== undefined) payload.newPassword = newPassword;
      await authApi.changePassword(payload);
    } catch (error) {
      throw handleApiError(error, 'Change Password Failed');
    }
  },
};
