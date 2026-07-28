import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { MailService } from '@core/services/mail.service';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload, AuthTokens } from '@patterns/types';
import { randomBytes } from 'crypto';
import { LoginAttemptReason, SessionStatus } from '@patterns/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });

    if (!user) {
      await this.logAttempt(
        loginDto.email,
        false,
        LoginAttemptReason.USER_NOT_FOUND,
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      await this.logAttempt(
        loginDto.email,
        false,
        LoginAttemptReason.USER_SUSPENDED,
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedException('User is not active');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);

    if (!isPasswordValid) {
      await this.logAttempt(
        loginDto.email,
        false,
        LoginAttemptReason.INVALID_PASSWORD,
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.logAttempt(loginDto.email, true, LoginAttemptReason.SUCCESS, ipAddress, userAgent);

    // Find the first ACTIVE workspace owned by the user
    const activeWorkspace = await this.prisma.workspace.findFirst({
      where: { ownerId: user.id, status: 'ACTIVE', deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    // Create session
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        status: SessionStatus.ACTIVE,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        activeWorkspaceId: activeWorkspace ? activeWorkspace.id : null,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, session.id, user.tokenVersion);

    // Create refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await argon2.hash(tokens.refreshToken),
        familyId: session.id, // Using session ID as family ID for simplicity
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ipAddress,
        userAgent,
      },
    });

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastActivityAt: new Date() },
    });

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: this.getAccessTokenExpiresInSeconds(),
    };
  }

  async refresh(oldRefreshToken: string, ipAddress: string, userAgent: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { revokedAt: null },
    });

    let tokenRecord = null;
    for (const t of tokens) {
      if (await argon2.verify(t.tokenHash, oldRefreshToken)) {
        tokenRecord = t;
        break;
      }
    }

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    const session = await this.prisma.session.findUnique({
      where: { id: tokenRecord.familyId },
    });

    if (!session || session.status !== SessionStatus.ACTIVE) {
      throw new UnauthorizedException('Session is invalid or expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newTokens = await this.generateTokens(user.id, user.email, session.id, 1);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: await argon2.hash(newTokens.refreshToken),
        familyId: session.id,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresIn: this.getAccessTokenExpiresInSeconds(),
    };
  }

  async logout(sessionId: string, allDevices: boolean, userId: string) {
    if (allDevices) {
      await this.prisma.session.updateMany({
        where: { userId, status: SessionStatus.ACTIVE },
        data: { status: SessionStatus.REVOKED, revokedAt: new Date() },
      });
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else {
      await this.prisma.session.update({
        where: { id: sessionId },
        data: { status: SessionStatus.REVOKED, revokedAt: new Date() },
      });
      await this.prisma.refreshToken.updateMany({
        where: { familyId: sessionId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(64).toString('hex');
    return token;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== 'ACTIVE') return;

    const token = randomBytes(32).toString('hex');
    const tokenHash = await argon2.hash(token);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await this.mailService.sendPasswordResetEmail(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const activeTokens = await this.prisma.passwordResetToken.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
    });

    let validTokenRecord = null;
    for (const record of activeTokens) {
      if (await argon2.verify(record.tokenHash, token)) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await argon2.hash(newPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: validTokenRecord.userId },
        data: { passwordHash, passwordChangedAt: new Date(), tokenVersion: { increment: 1 } },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: validTokenRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  async changePassword(
    userId: string,
    currentPassword?: string,
    newPassword?: string,
  ): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Missing password fields');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isValid) throw new BadRequestException('Incorrect current password');

    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, passwordChangedAt: new Date(), tokenVersion: { increment: 1 } },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
    sessionId: string,
    tokenVersion: number,
  ) {
    const payload: JwtPayload = { sub: userId, email, sessionId, tokenVersion };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwtAccessSecret') as string,
      expiresIn: this.configService.get<string>('auth.jwtAccessExpires') as any,
    });

    const refreshToken = randomBytes(32).toString('hex');

    return { accessToken, refreshToken };
  }

  private getAccessTokenExpiresInSeconds(): number {
    // Simplified parsing of '15m'
    return 15 * 60;
  }

  private async logAttempt(
    email: string,
    success: boolean,
    reason: LoginAttemptReason,
    ipAddress: string,
    userAgent: string,
  ) {
    await this.prisma.loginAttempt.create({
      data: {
        email,
        success,
        reason,
        ipAddress,
        userAgent,
      },
    });
  }
}
