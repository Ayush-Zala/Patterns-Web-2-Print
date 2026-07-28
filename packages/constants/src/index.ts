// API
export const API_VERSION = 'v1';
export const API_PREFIX = '/api';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_LIMIT = 20;

// Caching
export const CACHE_TTL = 3600; // 1 hour

// Localization
export const DEFAULT_TIMEZONE = 'UTC';
export const DEFAULT_LOCALE = 'en-US';

// Files & Media
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
export const SUPPORTED_FONT_TYPES = ['font/woff', 'font/woff2', 'font/ttf', 'font/otf'];
export const SUPPORTED_FILE_TYPES = ['application/pdf', 'text/csv'];
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

// Security & Workspaces
export const WORKSPACE_DEFAULT_NAME = 'My Workspace';
export const MIN_PASSWORD_LENGTH = 8;

// HTTP
export const HEADERS = {
  REQUEST_ID: 'x-request-id',
  SESSION_ID: 'x-session-id',
  AUTHORIZATION: 'authorization',
  WORKSPACE_ID: 'x-workspace-id',
};

export const COOKIE_NAMES = {
  SESSION: 'patterns_session',
  REFRESH_TOKEN: 'patterns_refresh',
};

// Infrastructure
export const QUEUE_NAMES = {
  ASSETS: 'assets_processing',
  WEBHOOKS: 'webhooks',
};

export const BUCKET_NAMES = {
  PUBLIC: 'patterns-public',
  PRIVATE: 'patterns-private',
  TEMP: 'patterns-temp',
};
