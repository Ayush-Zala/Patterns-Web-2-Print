import { z } from 'zod';
import { Environment } from '@common/enums/environment.enum';

export const envSchema = z.object({
  NODE_ENV: z.nativeEnum(Environment).default(Environment.Development),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://postgres:postgres@localhost:5432/patterns?schema=public'),
  DATABASE_POOL_SIZE: z.coerce.number().default(10),
  DATABASE_LOG_LEVEL: z.string().default('error,warn'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),
  STORAGE_ENDPOINT: z.string().default('localhost'),
  STORAGE_PORT: z.coerce.number().default(9000),
  STORAGE_ACCESS_KEY: z.string().default('minioadmin'),
  STORAGE_SECRET_KEY: z.string().default('minioadmin'),
  STORAGE_USE_SSL: z.coerce.boolean().default(false),
  STORAGE_REGION: z.string().default('us-east-1'),

  // Auth Config
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  PASSWORD_PEPPER: z.string().min(16),
  COOKIE_DOMAIN: z.string().default('localhost'),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_PATH: z.string().default('/'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Environment variables validation error: ${result.error.message}`);
  }

  return result.data;
}
