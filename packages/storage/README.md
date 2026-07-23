# @patterns/storage

Storage provider interfaces for the Patterns monorepo.

## Purpose
Define common contracts for object storage operations (e.g., MinIO, S3). Applications and services will depend on the `StorageProvider` interface rather than a specific implementation.

## Public API
- `StorageProvider` (Interface)
- `StorageMetadata` (Interface)

## Dependency Rules
- **Can Import:** Nothing (Standalone).
- **Can be Imported by:** Any package or application.

## Usage
```typescript
import { StorageProvider } from '@patterns/storage';

export class MinioProvider implements StorageProvider {
  // Implementation details...
}
```
