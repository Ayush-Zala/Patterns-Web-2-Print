import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { WorkspaceService } from '../services/workspace.service';
import { WorkspaceAccessService } from '../services/workspace.access.service';
import { SlugService } from '../../../core/services/slug.service';
import { WorkspaceValidatorService } from '../validators/workspace.validator';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  UpdateWorkspaceStatusDto,
  WorkspaceQueryDto,
} from '../dto';
import { WorkspaceMapper } from '../mappers/workspace.mapper';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceAccessService: WorkspaceAccessService,
    private readonly workspaceMapper: WorkspaceMapper,
    private readonly slugService: SlugService,
    private readonly workspaceValidator: WorkspaceValidatorService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'List all workspaces owned by current user' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of owned workspaces' })
  async findMine(@Query() query: WorkspaceQueryDto, @CurrentUser('sub') currentUserId: string) {
    const { data, meta } = await this.workspaceService.findMany(query, currentUserId);
    return {
      success: true,
      data: data.map((ws) => this.workspaceMapper.toSummary(ws)),
      meta,
    };
  }

  @Get('validation/slug')
  @ApiOperation({ summary: 'Validate and generate unique slug' })
  @ApiResponse({ status: 200, description: 'Returns a guaranteed unique slug' })
  async checkSlug(@Query('name') name: string) {
    const slug = await this.workspaceValidator.validateAndGenerateUniqueSlug(name);
    return {
      success: true,
      data: { slug },
    };
  }

  @Get()
  @ApiOperation({ summary: 'List workspaces (admin/global view - alias to me for now)' })
  @ApiResponse({ status: 200, description: 'Returns workspaces' })
  async findAll(@Query() query: WorkspaceQueryDto, @CurrentUser('sub') currentUserId: string) {
    // For now, same as findMine unless user is admin
    return this.findMine(query, currentUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  @ApiHeader({ name: 'X-Workspace-Id', required: false, description: 'Future usage' })
  @ApiResponse({ status: 200, description: 'Returns the workspace' })
  async findOne(@Param('id') id: string, @CurrentUser('sub') currentUserId: string) {
    await this.workspaceAccessService.validateWorkspaceAccess(currentUserId, id);
    const workspace = await this.workspaceService.findById(id);
    return {
      success: true,
      data: this.workspaceMapper.toResponse(workspace),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'Workspace created successfully' })
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    const workspace = await this.workspaceService.create(
      createWorkspaceDto,
      currentUserId,
      currentUserId,
    );
    return {
      success: true,
      message: 'Workspace created successfully.',
      data: this.workspaceMapper.toResponse(workspace),
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workspace' })
  @ApiResponse({ status: 200, description: 'Workspace updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    await this.workspaceAccessService.validateWorkspaceAccess(currentUserId, id);
    const workspace = await this.workspaceService.update(id, updateWorkspaceDto, currentUserId);
    return {
      success: true,
      message: 'Workspace updated successfully.',
      data: this.workspaceMapper.toResponse(workspace),
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update workspace status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateWorkspaceStatusDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    await this.workspaceAccessService.validateWorkspaceAccess(currentUserId, id);
    const workspace = await this.workspaceService.updateStatus(
      id,
      updateStatusDto.status,
      currentUserId,
      currentUserId,
    );
    return {
      success: true,
      message: 'Status updated successfully.',
      data: this.workspaceMapper.toSummary(workspace),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a workspace' })
  @ApiResponse({ status: 204, description: 'Workspace deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser('sub') currentUserId: string) {
    await this.workspaceAccessService.validateWorkspaceAccess(currentUserId, id);
    await this.workspaceService.softDelete(id, currentUserId, currentUserId);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted workspace' })
  @ApiResponse({ status: 200, description: 'Workspace restored successfully' })
  async restore(@Param('id') id: string, @CurrentUser('sub') currentUserId: string) {
    await this.workspaceAccessService.validateWorkspaceRestoreAccess(currentUserId, id);
    const workspace = await this.workspaceService.restore(id, currentUserId);
    return {
      success: true,
      message: 'Workspace restored successfully.',
      data: this.workspaceMapper.toResponse(workspace),
    };
  }
}
