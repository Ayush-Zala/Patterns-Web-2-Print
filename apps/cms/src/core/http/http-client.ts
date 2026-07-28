import { ApiResponse } from '@/types/auth.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export type HttpRequestOptions = RequestInit & { retryCount?: number; skipAuth?: boolean };

class HttpClient {
  private inMemoryAccessToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private onSessionExpiredCallback: (() => void) | null = null;

  public setAccessToken(token: string | null) {
    this.inMemoryAccessToken = token;
  }

  public getAccessToken(): string | null {
    return this.inMemoryAccessToken;
  }

  public setOnSessionExpired(callback: () => void) {
    this.onSessionExpiredCallback = callback;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.inMemoryAccessToken) {
      headers['Authorization'] = `Bearer ${this.inMemoryAccessToken}`;
    }

    return headers;
  }

  public async request<T = any>(
    endpoint: string,
    options: HttpRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { retryCount = 0, skipAuth = false, headers: customHeaders, ...fetchOptions } = options;
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = this.getHeaders(customHeaders as Record<string, string>);

    if (fetchOptions.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include', // Ensure HttpOnly cookies (refresh token) are sent
      });

      // Handle 401 Unauthorized
      if (response.status === 401 && !skipAuth && retryCount === 0) {
        const newToken = await this.executeSingleRefresh();
        if (newToken) {
          // Retry the request once with new token
          return this.request<T>(endpoint, {
            ...options,
            retryCount: 1,
          });
        } else {
          // Refresh failed
          if (this.onSessionExpiredCallback) {
            this.onSessionExpiredCallback();
          }
          throw new Error('Session expired');
        }
      }

      let data = null;
      if (response.status !== 204) {
        // Only parse JSON if there's content
        const text = await response.text();
        data = text.trim() ? JSON.parse(text) : null;
      }

      if (!response.ok) {
        throw {
          status: response.status,
          message: data?.message || data?.error?.message || 'HTTP Request Failed',
          data,
        };
      }

      return data as ApiResponse<T>;
    } catch (error: any) {
      if (error.status) throw error;
      throw {
        status: 500,
        message: error.message || 'Network failure',
      };
    }
  }

  private async executeSingleRefresh(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshUrl = `${API_BASE_URL}/auth/refresh`;
        const res = await fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) {
          this.setAccessToken(null);
          return null;
        }

        const data = await res.json();
        const newToken = data.data?.accessToken || data.accessToken;
        if (newToken) {
          this.setAccessToken(newToken);
          return newToken;
        }

        this.setAccessToken(null);
        return null;
      } catch {
        this.setAccessToken(null);
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  public get<T = any>(endpoint: string, options?: HttpRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options?: HttpRequestOptions) {
    const reqOptions: HttpRequestOptions = { ...options, method: 'POST' };
    if (body !== undefined) {
      if (body instanceof FormData) {
        reqOptions.body = body;
        reqOptions.headers = { ...options?.headers, 'Content-Type': 'multipart/form-data' } as any;
      } else {
        reqOptions.body = JSON.stringify(body);
      }
    }
    return this.request<T>(endpoint, reqOptions);
  }

  public put<T = any>(endpoint: string, body?: any, options?: HttpRequestOptions) {
    const reqOptions: HttpRequestOptions = { ...options, method: 'PUT' };
    if (body !== undefined) {
      if (body instanceof FormData) {
        reqOptions.body = body;
        reqOptions.headers = { ...options?.headers, 'Content-Type': 'multipart/form-data' } as any;
      } else {
        reqOptions.body = JSON.stringify(body);
      }
    }
    return this.request<T>(endpoint, reqOptions);
  }

  public patch<T = any>(endpoint: string, body?: any, options?: HttpRequestOptions) {
    const reqOptions: HttpRequestOptions = { ...options, method: 'PATCH' };
    if (body !== undefined) {
      if (body instanceof FormData) {
        reqOptions.body = body;
        reqOptions.headers = { ...options?.headers, 'Content-Type': 'multipart/form-data' } as any;
      } else {
        reqOptions.body = JSON.stringify(body);
      }
    }
    return this.request<T>(endpoint, reqOptions);
  }

  public delete<T = any>(endpoint: string, options?: HttpRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
