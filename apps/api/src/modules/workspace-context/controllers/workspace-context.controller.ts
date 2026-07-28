import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkspaceContextInterceptor } from '../interceptors/workspace-context.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { CurrentContext } from '../decorators/current-context.decorator';
import { RequestContext } from '@patterns/types';
import { WorkspaceSessionService } from '../services/workspace-session.service';
import { CurrentSession } from '../decorators/current-session.decorator';
import { Session } from '@patterns/prisma';
import { WorkspaceRepository } from '../../workspace/repositories/workspace.repository';
import { WorkspaceQueryDto } from '../../workspace/dto';

import { WorkspaceMapper } from '../../workspace/mappers/workspace.mapper';

@ApiTags('Workspace Context')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(WorkspaceContextInterceptor)
@Controller('workspace-context')
export class WorkspaceContextController {
  constructor(
    private readonly workspaceSessionService: WorkspaceSessionService,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMapper: WorkspaceMapper,
  ) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current context' })
  @ApiHeader({
    name: 'x-workspace-id',
    required: false,
    description: 'Temporarily override active workspace',
  })
  async getCurrentContext(@CurrentContext() context: RequestContext) {
    return context;
  }

  @Patch('current')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Switch active workspace in session' })
  async switchWorkspace(
    @Body('workspaceId') workspaceId: string,
    @CurrentSession() session: Session,
    @Req() req: any,
  ): Promise<{ message: string; workspace: any }> {
    const workspace = await this.workspaceSessionService.switchWorkspace(
      session,
      workspaceId,
      req.user.sub,
      req.headers['x-request-id'] as string,
      req.headers['x-forwarded-for'] || req.ip,
      req.headers['user-agent'],
    );

    return {
      message: 'Workspace switched successfully',
      workspace,
    };
  }

  @Get('workspaces')
  @ApiOperation({ summary: 'List all owned workspaces' })
  async listWorkspaces(
    @CurrentContext() context: RequestContext,
    @Query() query: WorkspaceQueryDto,
  ): Promise<{ data: any[]; meta: any }> {
    if (context.type === 'anonymous') {
      return { data: [], meta: {} };
    }
    const userId = context.user.id;

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { ownerId: userId };

    if (query.status === 'ARCHIVED') {
      where.deletedAt = { not: null };
    } else {
      where.deletedAt = null;
      if (query.status) {
        where.status = query.status;
      }
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [workspaces, total] = await Promise.all([
      this.workspaceRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [query.sort || 'createdAt']: query.order || 'desc' },
      }),
      this.workspaceRepository.count(where),
    ]);

    return {
      data: workspaces.map((ws) => this.workspaceMapper.toSummary(ws as any)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
