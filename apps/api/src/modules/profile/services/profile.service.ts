import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { UploadService } from '../../upload/services/upload.service';
import * as argon2 from 'argon2';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async getProfile(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        phone: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; displayName?: string; phone?: string },
  ): Promise<any> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        phone: true,
      },
    });
  }

  async changePassword(
    userId: string,
    currentSessionId: string,
    currentPass: string,
    newPass: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await argon2.verify(user.passwordHash, currentPass);
    if (!isValid) throw new BadRequestException('Invalid current password');

    const passwordHash = await argon2.hash(newPass);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, passwordChangedAt: new Date() },
    });

    // Revoke all other sessions
    await this.prisma.session.updateMany({
      where: { userId, id: { not: currentSessionId } },
      data: { status: 'REVOKED', revokedAt: new Date() },
    });
  }

  async uploadAvatar(userId: string, file: any): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // delete old avatar if exists
    if (user.avatarFilename && user.avatarUrl) {
      // For MinIO, we need the bucket and key. Assuming 'patterns-public' bucket and key is avatarFilename
      try {
        await this.uploadService.deleteFile('patterns-public', user.avatarFilename);
      } catch (e) {}
    }

    const res = await this.uploadService.uploadFile(file, 'patterns-public', 'avatars');

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: res.url,
        avatarFilename: res.storageKey,
        avatarMimeType: res.mime,
        avatarSize: res.size,
      },
    });

    return res.url;
  }

  async deleteAvatar(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.avatarFilename) {
      await this.uploadService.deleteFile('patterns-public', user.avatarFilename);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: null,
        avatarFilename: null,
        avatarMimeType: null,
        avatarSize: null,
      },
    });
  }
}
