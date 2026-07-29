import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { StorefrontCompositeGuard } from '../guards/storefront-composite.guard';
import { ApiKeyRateLimitGuard } from '@modules/auth/guards/api-key-rate-limit.guard';
import { JwtService } from '@nestjs/jwt';
import { NativeWebsiteService } from '@modules/integration/services/native-website.service';
import { WordPressService } from '@modules/integration/services/wordpress.service';
import { StorefrontAuthDto } from '../dto/storefront-auth.dto';

@ApiTags('Storefront')
@Controller('storefront')
export class StorefrontController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly nativeWebsiteService: NativeWebsiteService,
    private readonly wordPressService: WordPressService,
  ) {}

  @Post('auth')
  @ApiOperation({ summary: 'Authenticate Storefront Integration (e.g. WordPress Plugin)' })
  async auth(@Body() dto: StorefrontAuthDto) {
    const integration = await this.prisma.integration.findUnique({
      where: { apiKey: dto.apiKey },
    });

    if (!integration) {
      throw new UnauthorizedException('Invalid API Key');
    }

    let result;
    if (integration.type === 'NATIVE_WEBSITE') {
      result = await this.nativeWebsiteService.verifyCredentials(dto.apiKey, dto.apiSecret);
    } else if (integration.type === 'WORDPRESS') {
      result = await this.wordPressService.verifyCredentials(dto.apiKey, dto.apiSecret);
    } else {
      throw new BadRequestException(
        'Authentication via this endpoint is not supported for this integration type',
      );
    }

    const payload = {
      sub: result.id,
      type: 'integration',
      integrationType: result.type,
      workspaceId: result.workspaceId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      success: true,
      data: {
        accessToken,
        expiresIn: 3600,
        workspaceId: result.workspace.id,
        workspaceName: result.workspace.name,
        connectionStatus: result.connectionStatus,
      },
    };
  }

  @Get('ping')
  @UseGuards(ApiKeyRateLimitGuard, StorefrontCompositeGuard)
  @ApiOperation({ summary: 'Storefront Handshake / Ping' })
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
  @UseGuards(ApiKeyRateLimitGuard, StorefrontCompositeGuard)
  @ApiOperation({ summary: 'Get published products' })
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
