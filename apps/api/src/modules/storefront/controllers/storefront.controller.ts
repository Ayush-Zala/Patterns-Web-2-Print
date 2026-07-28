import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { ApiKeyGuard } from '@modules/auth/guards/api-key.guard';
import { ApiKeyRateLimitGuard } from '@modules/auth/guards/api-key-rate-limit.guard';

@ApiTags('Storefront')
@Controller('storefront')
export class StorefrontController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('ping')
  @UseGuards(ApiKeyRateLimitGuard, ApiKeyGuard)
  @ApiOperation({ summary: 'Storefront Handshake / Ping' })
  @ApiHeader({ name: 'x-api-key', required: true })
  @ApiHeader({ name: 'x-api-secret', required: true })
  ping(@Req() req: any) {
    return {
      success: true,
      message: 'pong',
      data: {
        workspaceId: req.context.workspace.id,
        integrationId: req.integration.id,
        currency: (req.context.workspace.settings as any)?.theme?.currency || 'USD',
        dateFormat: (req.context.workspace.settings as any)?.theme?.dateFormat || 'MM/DD/YYYY',
        timezone: (req.context.workspace.settings as any)?.theme?.timezone || 'UTC',
      },
    };
  }

  @Get('products')
  @UseGuards(ApiKeyRateLimitGuard, ApiKeyGuard)
  @ApiOperation({ summary: 'Get published products' })
  @ApiHeader({ name: 'x-api-key', required: true })
  @ApiHeader({ name: 'x-api-secret', required: true })
  async getProducts(@Req() req: any) {
    const products = await this.prisma.product.findMany({
      where: {
        workspaceId: req.context.workspace.id,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: products,
    };
  }
}
