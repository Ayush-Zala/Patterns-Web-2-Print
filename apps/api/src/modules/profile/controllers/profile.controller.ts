import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProfileService } from '../services/profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuditPublisher } from '../../audit/services/audit.publisher';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly auditPublisher: AuditPublisher,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any): Promise<{ success: boolean; data: any }> {
    const profile = await this.profileService.getProfile(req.user.sub);
    return { success: true, data: profile };
  }

  @Patch()
  @ApiOperation({ summary: 'Update profile information' })
  async updateProfile(
    @Req() req: any,
    @Body() body: any,
  ): Promise<{ success: boolean; data: any }> {
    const profile = await this.profileService.updateProfile(req.user.sub, body);

    this.auditPublisher.publish({
      userId: req.user.sub,
      action: 'UPDATE_PROFILE',
      resource: 'User',
      resourceId: req.user.sub,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return { success: true, data: profile };
  }

  @Patch('password')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Req() req: any,
    @Body() body: any,
  ): Promise<{ success: boolean; message: string }> {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Current and new password are required');
    }

    await this.profileService.changePassword(
      req.user.sub,
      req.user.sessionId,
      body.currentPassword,
      body.newPassword,
    );

    this.auditPublisher.publish({
      userId: req.user.sub,
      action: 'CHANGE_PASSWORD',
      resource: 'User',
      resourceId: req.user.sub,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return { success: true, message: 'Password changed successfully. Other sessions revoked.' };
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload an avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: any,
  ): Promise<{ success: boolean; data: any }> {
    if (!file) throw new BadRequestException('File is required');
    const url = await this.profileService.uploadAvatar(req.user.sub, file);
    return { success: true, data: { avatarUrl: url } };
  }

  @Delete('avatar')
  @ApiOperation({ summary: 'Delete avatar' })
  async deleteAvatar(@Req() req: any): Promise<{ success: boolean; message: string }> {
    await this.profileService.deleteAvatar(req.user.sub);
    return { success: true, message: 'Avatar deleted' };
  }
}
