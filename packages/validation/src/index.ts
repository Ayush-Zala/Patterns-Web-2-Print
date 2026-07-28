import { z } from 'zod';
import { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from '@patterns/constants';

// -----------------------------------------------------------------------------
// Primitive Validators
// -----------------------------------------------------------------------------

export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const urlSchema = z.string().url();
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');
export const hexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color');
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (E.164)');
export const currencyCodeSchema = z.string().length(3).toUpperCase();
export const languageCodeSchema = z
  .string()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language code (e.g., en-US)');
export const countryCodeSchema = z.string().length(2).toUpperCase();

// -----------------------------------------------------------------------------
// Authentication Validators
// -----------------------------------------------------------------------------

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters long')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// -----------------------------------------------------------------------------
// File & Media Validators
// -----------------------------------------------------------------------------

export const filenameSchema = z.string().regex(/^[a-zA-Z0-9_\-\.]+$/, 'Invalid filename format');
export const fileSizeSchema = (maxBytes: number) => z.number().int().positive().max(maxBytes);
export const imageDimensionsSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

// -----------------------------------------------------------------------------
// Common DTO Schemas
// -----------------------------------------------------------------------------

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});
