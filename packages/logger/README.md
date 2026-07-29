# @patterns/logger

Centralized logger abstraction for the Patterns monorepo.

## Purpose

Prevent direct `console.log` usage and decouple logging from specific libraries like `pino` so that we can swap them out or add new transports (like DataDog or CloudWatch) seamlessly.

## Public API

- `Logger` (Interface)
- `ConsoleLogger` (Implementation for local/dev)
- `PinoLogger` (Implementation for production)

## Dependency Rules

- **Can Import:** Nothing (Standalone).
- **Can be Imported by:** Any package or application.

## Usage

```typescript
import { Logger, PinoLogger } from '@patterns/logger';

const logger: Logger = new PinoLogger();
logger.info('Application started');
```
