# @patterns/permissions

Shared permission contracts for the Patterns monorepo.

## Purpose

Define common interfaces for Role-Based Access Control (RBAC) across the workspace.

## Public API

- `PermissionAction`
- `PermissionResource`
- `Scope`
- `Permission`
- `Role`

## Dependency Rules

- **Can Import:** Nothing (Standalone).
- **Can be Imported by:** Any package or application.

## Usage

```typescript
import { Role, Permission } from '@patterns/permissions';
```
