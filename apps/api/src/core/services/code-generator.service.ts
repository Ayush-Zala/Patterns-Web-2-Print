import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class CodeGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a code using a PostgreSQL sequence.
   * e.g., generateCode('workspace_code_seq', 'WS', 6) -> 'WS000001'
   */
  async generateCode(sequenceName: string, prefix: string, padding: number = 6): Promise<string> {
    // Note: This relies on the sequence existing in the database.
    const result = await this.prisma.$queryRawUnsafe<Array<{ nextval: string | number }>>(
      `SELECT nextval('${sequenceName}')`,
    );

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Failed to generate code from sequence: ${sequenceName}`);
    }

    const nextVal = result[0].nextval;
    const numberStr = String(nextVal).padStart(padding, '0');
    return `${prefix}${numberStr}`;
  }

  /**
   * Generates a prefixed public ID using a random string.
   * e.g., generatePublicId('upl') -> 'upl_abc123...'
   */
  async generatePublicId(prefix: string): Promise<string> {
    const { randomUUID } = await import('crypto');
    return `${prefix}_${randomUUID().replace(/-/g, '')}`;
  }
}
