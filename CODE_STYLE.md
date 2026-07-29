# Code Style & Engineering Standards

## Coding Guidelines

1. **TypeScript Strict Mode**: Explicit parameter types and return types are required. No `any` or `ts-ignore`.
2. **Imports**: Always use package barrel exports or path aliases (`@patterns/utils`, `@core/*`, `@common/*`). Deep imports are prohibited.
3. **Naming Conventions**:
   - Files: `kebab-case.ts`
   - Classes & Enums: `PascalCase`
   - Variables & Methods: `camelCase`
   - Constants: `UPPER_SNAKE_CASE`
