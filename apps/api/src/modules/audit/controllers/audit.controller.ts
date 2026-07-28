import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkspaceContextInterceptor } from '../../workspace-context/interceptors/workspace-context.interceptor';
import { WorkspaceGuard } from '../../workspace-context/guards/workspace.guard';
import { UseInterceptors } from '@nestjs/common';
import { WorkspaceId } from '../../workspace-context/decorators/workspace-id.decorator';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { WorkspaceContextMiddleware } from '../../workspace-context/middlewares/workspace-context.middleware';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@UseInterceptors(WorkspaceContextInterceptor)
@Controller('audit')
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List audit logs for the current workspace' })
  async listLogs(
    @WorkspaceId() workspaceId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<{ success: boolean; data: any[]; meta: any }> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { workspaceId },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      }),
      this.prisma.auditLog.count({ where: { workspaceId } }),
    ]);

    return {
      success: true,
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific audit log' })
  async getLog(
    @WorkspaceId() workspaceId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const log = await this.prisma.auditLog.findFirst({
      where: { publicId: id, workspaceId },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });

    if (!log) {
      return { success: false, error: 'Audit log not found' };
    }

    return { success: true, data: log };
  }
}
