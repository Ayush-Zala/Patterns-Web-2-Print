import { UserStatus } from '@patterns/prisma';
import { User as UserInterface } from '@patterns/types';

export class UserEntity implements UserInterface {
  id!: string;
  email!: string;
  passwordHash!: string;
  firstName!: string;
  lastName!: string;
  displayName!: string | null;
  avatarUrl!: string | null;
  avatarFilename!: string | null;
  avatarMimeType!: string | null;
  avatarSize!: number | null;
  phone!: string | null;
  status!: UserStatus;
  emailVerified!: boolean;
  emailVerifiedAt!: Date | null;
  lastLoginAt!: Date | null;
  lastActivityAt!: Date | null;
  tokenVersion!: number;
  passwordChangedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  get isLocked(): boolean {
    return this.status !== UserStatus.ACTIVE;
  }
}
