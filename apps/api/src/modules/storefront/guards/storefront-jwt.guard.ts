import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class StorefrontJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'integration') {
        throw new UnauthorizedException('Invalid token type');
      }

      const integration = await this.prisma.integration.findFirst({
        where: { id: payload.sub, deletedAt: null },
        include: { workspace: true },
      });

      if (!integration || integration.status !== 'ACTIVE') {
        throw new UnauthorizedException('Integration not found or inactive');
      }

      (request as any).integration = integration;
      (request as any).context = {
        workspace: integration.workspace,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
