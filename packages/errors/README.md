# @patterns/errors

Standardized error codes and exception classes for the Patterns monorepo.

## Purpose

Ensure all applications throw consistent error types with standardized `code` properties. This makes global exception filters, error monitoring, and frontend error mapping significantly easier and unified.

## Public API

- `ErrorCodes` (Enum-like object)
- `BaseError`
- `ValidationError`
- `NotFoundError`
- `UnauthorizedError`
- `ForbiddenError`
- `ConflictError`
- `InternalServerError`

## Dependency Rules

- **Can Import:** Nothing (Standalone).
- **Can be Imported by:** Any package or application.

## Usage

```typescript
import { NotFoundError } from '@patterns/errors';

throw new NotFoundError('User not found');
```
