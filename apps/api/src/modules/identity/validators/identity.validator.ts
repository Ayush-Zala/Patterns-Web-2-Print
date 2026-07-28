import { Injectable } from '@nestjs/common';

@Injectable()
export class IdentityValidator {
  normalizeEmail(email: string): string {
    return email.trim().toLowerCase().normalize('NFKC');
  }

  normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ').normalize('NFC');
  }
}
