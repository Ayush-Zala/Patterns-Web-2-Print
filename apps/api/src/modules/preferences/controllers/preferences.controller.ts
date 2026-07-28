import { Controller, Get, Patch, Body, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../workspace-context/guards/workspace.guard';
import { WorkspaceContextInterceptor } from '../../workspace-context/interceptors/workspace-context.interceptor';
import { WorkspaceId } from '../../workspace-context/decorators/workspace-id.decorator';
import { PreferencesService, PreferencesDto } from '../services/preferences.service';

@ApiTags('Preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@UseInterceptors(WorkspaceContextInterceptor)
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user preferences for the current workspace' })
  async getPreferences(
    @Req() req: any,
    @WorkspaceId() workspaceId: string,
  ): Promise<{ success: boolean; data: any }> {
    const prefs = await this.preferencesService.getPreferences(req.user.sub, workspaceId);
    return { success: true, data: prefs };
  }

  @Patch()
  @ApiOperation({ summary: 'Update user preferences for the current workspace' })
  async updatePreferences(
    @Req() req: any,
    @WorkspaceId() workspaceId: string,
    @Body() body: PreferencesDto,
  ): Promise<{ success: boolean; data: any }> {
    const prefs = await this.preferencesService.updatePreferences(req.user.sub, workspaceId, body);
    return { success: true, data: prefs };
  }
}
