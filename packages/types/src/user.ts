import { UserStatus } from '@patterns/prisma';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  avatarUrl: string | null;
  avatarFilename: string | null;
  avatarMimeType: string | null;
  avatarSize: number | null;
  phone: string | null;
  status: UserStatus;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  lastActivityAt: Date | null;
  tokenVersion: number;
  passwordChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
