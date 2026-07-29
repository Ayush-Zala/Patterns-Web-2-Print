# @patterns/utils

General-purpose, framework-agnostic utilities for the Patterns monorepo.

## Purpose

Prevent code duplication for common utility functions across applications and packages.

## Public API

- `sleep(ms)`
- `debounce(fn, wait)`
- `throttle(fn, limit)`
- `retry(fn, retries, delay)`
- `isUUID(str)`
- `formatBytes(bytes)`
- `formatDuration(ms)`
- `getFileExtension(filename)`
- `getMimeCategory(mimeType)`
- `copyToClipboard(text)`
- `isLightColor(hex)`

## Dependency Rules

- **Can Import:** `@patterns/constants`, `@patterns/types`
- **Can be Imported by:** Any package (except `constants` and `types`) or application.

## Usage

```typescript
import { sleep, formatBytes } from '@patterns/utils';
```
