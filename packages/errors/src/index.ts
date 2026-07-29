// -----------------------------------------------------------------------------
// Standard Error Codes
// -----------------------------------------------------------------------------

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// -----------------------------------------------------------------------------
// Base Error Class
// -----------------------------------------------------------------------------

export class BaseError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(message: string, code: ErrorCode, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// -----------------------------------------------------------------------------
// Standard Errors
// -----------------------------------------------------------------------------

export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCodes.VALIDATION_ERROR, details);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCodes.NOT_FOUND, details);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super(message, ErrorCodes.UNAUTHORIZED, details);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super(message, ErrorCodes.FORBIDDEN, details);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCodes.CONFLICT, details);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string = 'Internal Server Error', details?: unknown) {
    super(message, ErrorCodes.INTERNAL_ERROR, details);
  }
}
