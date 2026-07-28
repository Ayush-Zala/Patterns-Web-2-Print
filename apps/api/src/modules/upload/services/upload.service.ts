import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { StorageService } from '@core/storage/storage.service';
import { CodeGeneratorService } from '@core/services/code-generator.service';
import * as crypto from 'crypto';
import * as path from 'path';

export interface UploadResponse {
  url: string;
  filename: string;
  mime: string;
  size: number;
  publicId: string;
  bucket: string;
  storageKey: string;
  checksum: string;
  uploadedAt: Date;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly storageService: StorageService,
    private readonly codeGenerator: CodeGeneratorService,
  ) {}

  async uploadFile(file: any, bucket: string, prefix: string): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const publicId = await this.codeGenerator.generatePublicId('upl');
    const ext = path.extname(file.originalname);
    const storageKey = `${prefix}/${publicId}${ext}`;
    const checksum = crypto.createHash('md5').update(file.buffer).digest('hex');

    const url = await this.storageService
      .getProvider()
      .upload(bucket, storageKey, file.buffer, file.mimetype);

    return {
      url,
      filename: file.originalname,
      mime: file.mimetype,
      size: file.size,
      publicId,
      bucket,
      storageKey,
      checksum,
      uploadedAt: new Date(),
    };
  }

  async deleteFile(bucket: string, storageKey: string): Promise<void> {
    await this.storageService.getProvider().delete(bucket, storageKey);
  }
}
