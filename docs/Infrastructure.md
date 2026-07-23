# Infrastructure Architecture

## Architecture Overview

The Patterns infrastructure leverages a containerized, environment-driven architecture powered by Docker Compose. The infrastructure is entirely isolated from the application code, ensuring that all services (databases, caches, object storage, and admin tools) are robust, idempotent, and independently scalable.

All services are defined in `infrastructure/docker/docker-compose.yml` and utilize environment variables via `.env` to prevent any hardcoded credentials, paths, or ports.

## Network Diagram

```text
                +----------------+
                | Docker Network |
                | patterns-network|
                +----------------+
          /        |        |        \
         /         |        |         \
 PostgreSQL     Redis    MinIO     pgAdmin
                      \
                   RedisInsight
```

## Volumes
We use strictly managed named volumes to ensure that persistent data survives container restarts and destruction.
- **`postgres-data`**: PostgreSQL database files.
- **`redis-data`**: Redis caching data (AOF enabled).
- **`minio-data`**: MinIO object storage files.
- **`pgadmin-data`**: pgAdmin user configurations and saved servers.
- **`redisinsight-data`**: RedisInsight workspace data.

## MinIO Bucket Strategy
*Note: Buckets are not auto-provisioned by infrastructure. They will be created by the application tier.*
Intended buckets for future phases:
- `assets`: General workspace assets.
- `previews`: Generated document previews.
- `thumbnails`: Compressed image thumbnails.
- `exports`: Final print-ready exports.
- `templates`: Base document templates.
- `fonts`: Custom user fonts.
- `cliparts`: Vector graphics.

## Container Communication
All containers are attached to the `patterns-network` bridge network. Internal communication must always utilize service names (e.g., `postgres`, `redis`, `minio`), avoiding IP addresses entirely. 

## Developer Workflow
1. Navigate to `infrastructure/docker/` and ensure a `.env` file exists (copied from `.env.example`).
2. Utilize the helper scripts in `infrastructure/scripts/` (e.g., `.\start.ps1`) to orchestrate the infrastructure without directly interacting with Docker Compose commands.
3. Access local services via `localhost:<PORT>` (e.g., pgAdmin on `localhost:5050`).

## Future Services
The `docker-compose.yml` is heavily commented and structured to allow seamless inclusion of future containerized applications (`patterns-api`, `patterns-worker`, `patterns-website`, etc.) without altering the underlying infrastructure foundation.
