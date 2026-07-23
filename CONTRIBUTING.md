# Contributing to Patterns

Thank you for contributing to Patterns! This guide outlines the development workflow and engineering standards.

## Quality Checklist
Before submitting a Pull Request, ensure:
1. All workspace packages build: `pnpm run build`
2. Lint and formatting pass: `pnpm run lint` & `pnpm run format:check`
3. Types pass strictly: `pnpm run typecheck`
4. Commits follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation change
   - `chore:` Maintenance
   - `refactor:` Code restructuring
   - `perf:` Performance enhancement

## Git & Branch Workflow
- `main`: Production branch (protected)
- `develop`: Staging / integration branch
- `feature/*`: Feature development
- `hotfix/*`: Production hotfixes
