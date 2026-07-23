# Patterns API

This is the core backend API for the Patterns Web-to-Print SaaS platform, built on NestJS.

## Technology Stack
- **Framework**: NestJS v10
- **Validation**: Zod (for env) and Class-Validator (for DTOs)
- **Logging**: Pino
- **Security**: Helmet, Compression, CORS

## Starting the API

### Standard Monorepo Start
To start the API in development mode using Turborepo (preferred):
```bash
pnpm run dev --filter @patterns/api
```

### Required Environment Variables
The API will fail to start if these are not provided (managed by Zod validation):
```env
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Useful Endpoints

- **Swagger Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Health Check**: [http://localhost:4000/api/v1/system/health](http://localhost:4000/api/v1/system/health)
- **System Info**: [http://localhost:4000/api/v1/system/info](http://localhost:4000/api/v1/system/info)

## Project Structure
```text
src/
├── common/        # Global constants, decorators, interceptors, filters, middlewares
├── config/        # Environment validation and config service
├── core/          # Global core modules (Logger, Health, System)
├── modules/       # Domain specific business modules (Authentication, Users, etc.)
├── shared/        # Shared global types and interfaces
├── app.module.ts  # Root application module
└── main.ts        # Bootstrap
```
