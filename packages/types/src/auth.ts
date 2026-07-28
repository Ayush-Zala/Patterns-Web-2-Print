import { User } from './user';

export interface JwtPayload {
  sub: string;
  email: string;
  sessionId: string;
  tokenVersion: number;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    expiresIn: number;
    user?: Partial<User>;
  };
}

export interface AuthMeResponse {
  success: boolean;
  data: {
    user: Partial<User>;
  };
}
