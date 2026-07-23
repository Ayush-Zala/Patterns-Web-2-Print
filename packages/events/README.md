# @patterns/events

Shared event contracts for the Patterns monorepo.

## Purpose
Define common interfaces for domain events and message buses. These interfaces will be implemented by messaging solutions (like BullMQ or Kafka) in future phases.

## Public API
- `EventBus`
- `EventHandler`
- `EventMetadata`
- `DomainEvent`

## Dependency Rules
- **Can Import:** Nothing (Standalone).
- **Can be Imported by:** Any package or application.

## Usage
```typescript
import { EventBus, DomainEvent } from '@patterns/events';
```
