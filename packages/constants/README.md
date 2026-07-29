# @patterns/constants

Centralized application constants for the Patterns monorepo.

## Purpose

Ensure consistent magic strings, defaults, and configuration keys across all applications and packages.

## Public API

- `API_VERSION`
- `DEFAULT_PAGE_SIZE`
- `MAX_PAGE_SIZE`
- `CACHE_TTL`
- `HEADER_NAMES`
- `COOKIE_NAMES`
- `QUEUE_NAMES`
- `BUCKET_NAMES`

## Dependency Rules

- **Can Import:** Nothing (Standalone).
- **Can be Imported by:** Any package or application.

## Usage

```typescript
import { DEFAULT_PAGE_SIZE } from '@patterns/constants';
```
