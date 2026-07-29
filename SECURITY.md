# Security Policy & Architecture

## Security Baseline

1. **HTTP Security Headers**: Powered by `helmet` with custom Content Security Policy (CSP), X-Frame-Options (`DENY`), and X-Content-Type-Options.
2. **CORS**: Environment-driven CORS policies rejecting unknown origins in production.
3. **Secrets Management**: Secrets are externalized into environment variables (`.env`). No credentials allowed in source code.
4. **Dependencies**: Automated vulnerability scans run weekly via GitHub Actions and Dependabot.
5. **Docker Security**: All production Docker images execute as non-root users (`USER node` / `USER nestjs`).
