import { Client, ItemBucketMetadata } from 'minio';
import { StorageProvider, StorageMetadata } from '@patterns/storage';
import { BUCKET_NAMES } from '@patterns/constants';

export interface MinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  region?: string;
}

export class MinioStorageProvider implements StorageProvider {
  private client: Client;

  constructor(config: MinioConfig) {
    this.client = new Client({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
      region: config.region ?? 'us-east-1',
    });
  }

  /**
   * Auto-initializes standard buckets defined in BUCKET_NAMES.
   */
  async initializeBuckets(): Promise<void> {
    const defaultBuckets = Object.values(BUCKET_NAMES);
    for (const bucket of defaultBuckets) {
      const exists = await this.client.bucketExists(bucket).catch(() => false);
      if (!exists) {
        await this.client.makeBucket(bucket, 'us-east-1');
      }

      if (bucket === BUCKET_NAMES.PUBLIC) {
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };
        await this.client.setBucketPolicy(bucket, JSON.stringify(policy)).catch(console.error);
      }
    }
  }

  async upload(
    bucket: string,
    path: string,
    data: Buffer | Uint8Array,
    mimeType?: string,
  ): Promise<string> {
    const meta: ItemBucketMetadata = mimeType ? { 'Content-Type': mimeType } : {};
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    await this.client.putObject(bucket, path, buffer, buffer.length, meta);
    return path;
  }

  async download(bucket: string, path: string): Promise<Buffer> {
    const dataStream = await this.client.getObject(bucket, path);
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      dataStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      dataStream.on('end', () => resolve(Buffer.concat(chunks)));
      dataStream.on('error', (err) => reject(err));
    });
  }

  async delete(bucket: string, path: string): Promise<boolean> {
    try {
      await this.client.removeObject(bucket, path);
      return true;
    } catch {
      return false;
    }
  }

  async exists(bucket: string, path: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, path);
      return true;
    } catch {
      return false;
    }
  }

  async copy(bucket: string, sourcePath: string, destinationPath: string): Promise<void> {
    const cond = new (require('minio').CopyConditions)();
    await this.client.copyObject(bucket, destinationPath, `/${bucket}/${sourcePath}`, cond);
  }

  async move(bucket: string, sourcePath: string, destinationPath: string): Promise<void> {
    await this.copy(bucket, sourcePath, destinationPath);
    await this.delete(bucket, sourcePath);
  }

  async generateSignedUrl(bucket: string, path: string, expiresInSeconds = 3600): Promise<string> {
    return this.client.presignedGetObject(bucket, path, expiresInSeconds);
  }

  async list(bucket: string, prefix = ''): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const items: string[] = [];
      const stream = this.client.listObjectsV2(bucket, prefix, true);
      stream.on('data', (item) => {
        if (item.name) items.push(item.name);
      });
      stream.on('end', () => resolve(items));
      stream.on('error', (err) => reject(err));
    });
  }

  async metadata(bucket: string, path: string): Promise<StorageMetadata> {
    const stat = await this.client.statObject(bucket, path);
    return {
      size: stat.size,
      mimeType: (stat.metaData?.['content-type'] as string) || 'application/octet-stream',
      updatedAt: stat.lastModified,
    };
  }
}
