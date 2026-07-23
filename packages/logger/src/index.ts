import pino from 'pino';

// -----------------------------------------------------------------------------
// Logger Interface
// -----------------------------------------------------------------------------

export interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void;
}

// -----------------------------------------------------------------------------
// Console Logger Implementation
// -----------------------------------------------------------------------------

export class ConsoleLogger implements Logger {
  info(message: string, context?: Record<string, unknown>): void {
    console.log(`[INFO] ${message}`, context || '');
  }
  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, context || '');
  }
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, error || '', context || '');
  }
  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(`[DEBUG] ${message}`, context || '');
  }
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(`[FATAL] ${message}`, error || '', context || '');
  }
}

// -----------------------------------------------------------------------------
// Pino Logger Implementation
// -----------------------------------------------------------------------------

export class PinoLogger implements Logger {
  private logger = pino();

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(context || {}, message);
  }
  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(context || {}, message);
  }
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.logger.error({ err: error, ...context }, message);
  }
  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(context || {}, message);
  }
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.logger.fatal({ err: error, ...context }, message);
  }
}
