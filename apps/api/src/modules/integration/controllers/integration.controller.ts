import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { IntegrationService } from '../services/integration.service';
import { IntegrationMapper } from '../mappers/integration.mapper';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import { UpdateIntegrationDto } from '../dto/update-integration.dto';
import { NativeWebsiteService } from '../services/native-website.service';
import { WordPressService } from '../services/wordpress.service';
import { IntegrationQueryDto } from '../dto/integration-query.dto';
import { CurrentWorkspace } from '@modules/workspace-context/decorators/current-workspace.decorator';
import { WorkspaceGuard } from '@modules/workspace-context/guards/workspace.guard';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { WorkspaceContextInterceptor } from '@modules/workspace-context/interceptors/workspace-context.interceptor';

import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@ApiTags('Integrations')
@ApiBearerAuth()
@ApiHeader({ name: 'x-workspace-id', required: true })
@UseInterceptors(WorkspaceContextInterceptor)
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('integrations')
export class IntegrationController {
  constructor(
    private readonly service: IntegrationService,
    private readonly mapper: IntegrationMapper,
    private readonly nativeWebsiteService: NativeWebsiteService,
    private readonly wordPressService: WordPressService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new integration' })
  async create(
    @CurrentWorkspace('id') workspaceId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateIntegrationDto,
  ) {
    const integration = await this.service.create(workspaceId, userId, dto);
    return {
      success: true,
      message: 'Integration created successfully',
      data: this.mapper.toResponseDto(integration),
    };
  }

  @Get()
  @ApiOperation({ summary: 'List integrations' })
  async findMany(@CurrentWorkspace('id') workspaceId: string, @Query() query: IntegrationQueryDto) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const { data, total } = await this.service.findMany(workspaceId, { ...query, page, limit });
    return {
      success: true,
      message: 'Request completed successfully',
      data: {
        data: data.map((item) => this.mapper.toResponseDto(item)),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  @Post(':id/connect')
  @ApiOperation({ summary: 'Generate integration credentials' })
  async connect(
    @CurrentWorkspace('id') workspaceId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    const integration = await this.service.findOne(workspaceId, id);
    let data;
    if (integration.type === 'NATIVE_WEBSITE') {
      data = await this.nativeWebsiteService.connect(workspaceId, id, userId);
    } else if (integration.type === 'WORDPRESS') {
      data = await this.wordPressService.connect(workspaceId, id, userId);
    } else {
      throw new BadRequestException('Connection not supported for this integration type');
    }
    return { success: true, message: 'Connected successfully', data };
  }

  @Post(':id/rotate-secret')
  @ApiOperation({ summary: 'Rotate integration secret' })
  async rotateSecret(
    @CurrentWorkspace('id') workspaceId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    const integration = await this.service.findOne(workspaceId, id);
    let data;
    if (integration.type === 'NATIVE_WEBSITE') {
      data = await this.nativeWebsiteService.rotateSecret(workspaceId, id, userId);
    } else if (integration.type === 'WORDPRESS') {
      data = await this.wordPressService.rotateSecret(workspaceId, id, userId);
    } else {
      throw new BadRequestException('Secret rotation not supported for this integration type');
    }
    return { success: true, message: 'Rotated secret successfully', data };
  }

  @Post(':id/disconnect')
  @ApiOperation({ summary: 'Disconnect integration without deleting credentials' })
  async disconnect(
    @CurrentWorkspace('id') workspaceId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<any> {
    const integration = await this.service.findOne(workspaceId, id);
    if (integration.type !== 'WORDPRESS' && integration.type !== 'NATIVE_WEBSITE') {
      throw new BadRequestException('Disconnect not supported for this integration type');
    }
    // Update connection status to DISCONNECTED
    const data = await this.service.update(workspaceId, id, userId, {
      connectionStatus: 'DISCONNECTED',
    } as any);
    return { success: true, message: 'Disconnected successfully', data };
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get integration connection status' })
  async getStatus(@CurrentWorkspace('id') workspaceId: string, @Param('id') id: string) {
    const integration = await this.service.findOne(workspaceId, id);
    let data;
    if (integration.type === 'NATIVE_WEBSITE') {
      data = await this.nativeWebsiteService.getStatus(workspaceId, id);
    } else if (integration.type === 'WORDPRESS') {
      data = await this.wordPressService.getStatus(workspaceId, id);
    } else {
      throw new BadRequestException('Status not supported for this integration type');
    }
    return { success: true, message: 'Status fetched', data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration details' })
  async findOne(@CurrentWorkspace('id') workspaceId: string, @Param('id') id: string) {
    const integration = await this.service.findOne(workspaceId, id);
    return {
      success: true,
      message: 'Request completed successfully',
      data: this.mapper.toResponseDto(integration),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update integration' })
  async update(
    @CurrentWorkspace('id') workspaceId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateIntegrationDto,
  ) {
    const integration = await this.service.update(workspaceId, id, userId, dto);
    return {
      success: true,
      message: 'Integration updated successfully',
      data: this.mapper.toResponseDto(integration),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove integration (soft delete)' })
  async remove(
    @CurrentWorkspace('id') workspaceId: string,
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    await this.service.softDelete(workspaceId, id, userId);
  }
}
