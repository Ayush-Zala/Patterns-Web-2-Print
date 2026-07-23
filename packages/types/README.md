# @patterns/types

Shared TypeScript utility types and interfaces for the Patterns monorepo.

## Purpose
Ensure all applications and packages rely on strict, standardized types for generics, API responses, and pagination. 

## Public API
- `Nullable<T>`
- `Optional<T>`
- `UUID`
- `DeepPartial<T>`
- `Paginated<T>`
- `ApiResult<T>`
- `Dictionary<T>`
- `Timestamp`

## Dependency Rules
- **Can Import:** `@patterns/constants`.
- **Can be Imported by:** Any package or application.

## Usage
```typescript
import { Paginated, Nullable } from '@patterns/types';
```
