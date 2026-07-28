import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { WorkspaceGuard } from '../../workspace-context/guards/workspace.guard';
import { WorkspaceContextInterceptor } from '../../workspace-context/interceptors/workspace-context.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UploadService } from '../services/upload.service';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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
  async uploadAvatar(@UploadedFile() file: any): Promise<{ success: boolean; data: any }> {
    if (!file) throw new BadRequestException('File is required');
    const response = await this.uploadService.uploadFile(file, 'patterns-public', 'avatars');
    return { success: true, data: response };
  }

  @Post('logo')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a workspace logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  async uploadLogo(@UploadedFile() file: any): Promise<{ success: boolean; data: any }> {
    if (!file) throw new BadRequestException('File is required');
    const response = await this.uploadService.uploadFile(file, 'patterns-public', 'logos');
    return { success: true, data: response };
  }

  @Post('temp')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a temporary file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  async uploadTemp(@UploadedFile() file: any): Promise<{ success: boolean; data: any }> {
    if (!file) throw new BadRequestException('File is required');
    const response = await this.uploadService.uploadFile(file, 'patterns-temp', 'temp');
    return { success: true, data: response };
  }

  @Post('product')
  @UseGuards(WorkspaceGuard)
  @UseInterceptors(WorkspaceContextInterceptor)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  async uploadProductImage(
    @UploadedFile() file: any,
    @Req() req: any,
  ): Promise<{ success: boolean; data: any }> {
    if (!file) throw new BadRequestException('File is required');

    // Ensure we have a workspace context
    const workspaceName = req.context?.workspace?.name || 'default';
    const workspaceSlug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const folderPath = `${workspaceSlug}/products`;

    try {
      const response = await this.uploadService.uploadFile(file, 'patterns-public', folderPath);
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error?.message || String(error),
        stack: error?.stack,
      } as any;
    }
  }

  @Post('document')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
      fileFilter: (req, file, cb) => {
        if (
          !file.mimetype.match(
            /^(application\/pdf|text\/csv|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/,
          )
        ) {
          return cb(new BadRequestException('Only documents are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
  })
  async uploadDocument(@UploadedFile() file: any): Promise<{ success: boolean; data: any }> {
    if (!file) throw new BadRequestException('File is required');
    const response = await this.uploadService.uploadFile(file, 'patterns-private', 'documents');
    return { success: true, data: response };
  }
}
