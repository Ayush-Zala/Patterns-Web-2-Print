# @patterns/storage-minio

Concrete MinIO / S3 object storage implementation of the `@patterns/storage` `StorageProvider` interface.

## Purpose
Provides object storage interaction logic using MinIO. Follows dependency inversion so that switching storage engines (e.g., S3, R2, GCS) only requires swapping the implementation package.

## Public API
- `MinioStorageProvider`
- `MinioConfig`

## Usage
```typescript
import { MinioStorageProvider } from '@patterns/storage-minio';

const storage = new MinioStorageProvider({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});
```
