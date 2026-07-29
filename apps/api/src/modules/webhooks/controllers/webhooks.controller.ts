import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from '../services/webhooks.service';
import { CreateWebhookDto } from '../dto/create-webhook.dto';
import { UpdateWebhookDto } from '../dto/update-webhook.dto';
import { WebhooksMapper } from '../mappers/webhooks.mapper';
import { CurrentWorkspace } from '../../workspace-context/decorators/current-workspace.decorator';
import { Workspace } from '@patterns/prisma';

@ApiTags('webhooks')
@ApiBearerAuth()
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new webhook' })
  async createWebhook(@CurrentWorkspace() workspace: Workspace, @Body() dto: CreateWebhookDto) {
    const { webhook, plainTextSecret } = await this.webhooksService.createWebhook(
      workspace.id,
      dto,
    );
    return {
      success: true,
      data: {
        ...WebhooksMapper.toResponseDto(webhook),
        secret: plainTextSecret, // only returned once
      },
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all webhooks in workspace' })
  async getWebhooks(@CurrentWorkspace() workspace: Workspace) {
    const webhooks = await this.webhooksService.getWebhooks(workspace.id);
    return {
      success: true,
      data: webhooks.map(WebhooksMapper.toResponseDto),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single webhook' })
  async getWebhook(@CurrentWorkspace() workspace: Workspace, @Param('id') id: string) {
    const webhook = await this.webhooksService.getWebhook(workspace.id, id);
    return {
      success: true,
      data: WebhooksMapper.toResponseDto(webhook),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a webhook' })
  async updateWebhook(
    @CurrentWorkspace() workspace: Workspace,
    @Param('id') id: string,
    @Body() dto: UpdateWebhookDto,
  ) {
    const webhook = await this.webhooksService.updateWebhook(workspace.id, id, dto);
    return {
      success: true,
      data: WebhooksMapper.toResponseDto(webhook),
    };
  }

  @Post(':id/rotate-secret')
  @ApiOperation({ summary: 'Rotate the signing secret for a webhook' })
  async rotateSecret(@CurrentWorkspace() workspace: Workspace, @Param('id') id: string) {
    const { webhook, plainTextSecret } = await this.webhooksService.rotateSecret(workspace.id, id);
    return {
      success: true,
      data: {
        ...WebhooksMapper.toResponseDto(webhook),
        secret: plainTextSecret,
      },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a webhook' })
  async deleteWebhook(@CurrentWorkspace() workspace: Workspace, @Param('id') id: string) {
    await this.webhooksService.deleteWebhook(workspace.id, id);
    return { success: true, data: null };
  }

  @Get(':id/deliveries')
  @ApiOperation({ summary: 'Get delivery logs for a webhook' })
  async getDeliveries(
    @CurrentWorkspace() workspace: Workspace,
    @Param('id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 50;

    const { deliveries, total } = await this.webhooksService.getDeliveries(
      workspace.id,
      id,
      skipNum,
      takeNum,
    );

    return {
      success: true,
      data: deliveries.map(WebhooksMapper.toDeliveryResponseDto),
      meta: { total, skip: skipNum, take: takeNum },
    };
  }
}
