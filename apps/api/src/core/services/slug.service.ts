import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  /**
   * Generates a URL-friendly slug from a string.
   * Handles unicode, trims whitespace, removes special characters, and limits length.
   */
  generate(input: string, maxLength: number = 100): string {
    let slug = input
      .normalize('NFD') // Normalize unicode characters (e.g., Café -> Cafe)
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/[\s-]+/g, '-') // Replace spaces and multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end

    if (slug.length > maxLength) {
      // Truncate to max length without splitting a word if possible
      slug = slug.substring(0, maxLength);
      // Strip trailing hyphen again just in case the cut was in the middle of one
      slug = slug.replace(/-+$/g, '');
    }

    return slug || 'untitled';
  }

  /**
   * Appends a sequence number to a slug.
   */
  appendSequence(slug: string, sequence: number): string {
    return `${slug}-${sequence}`;
  }
}
