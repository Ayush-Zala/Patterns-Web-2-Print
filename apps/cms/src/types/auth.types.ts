export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
  status?: string;
  avatarUrl?: string | null;
  mustChangePassword?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  code: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  status: string;
  ownerId: string;
  settings?: any;
}

export interface UserPreference {
  id: string;
  userId: string;
  workspaceId?: string | null;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  sidebarCollapsed?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
