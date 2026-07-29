# @patterns/validation

Reusable Zod schemas and validation utilities for the Patterns monorepo.

## Purpose

Ensure all applications use the exact same validation logic for common primitives (UUID, email, phone numbers, files, pagination).

## Public API

- `uuidSchema`
- `emailSchema`
- `urlSchema`
- `slugSchema`
- `hexColorSchema`
- `phoneSchema`
- `currencyCodeSchema`
- `languageCodeSchema`
- `countryCodeSchema`
- `filenameSchema`
- `fileSizeSchema`
- `imageDimensionsSchema`
- `paginationSchema`

## Dependency Rules

- **Can Import:** `@patterns/constants`, `@patterns/types`, `@patterns/utils`
- **Can be Imported by:** Any package or application (except `constants`, `types`, `utils`).

## Usage

```typescript
import { paginationSchema, emailSchema } from '@patterns/validation';

const result = emailSchema.parse('test@example.com');
```
