import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Prisma } from '@patterns/prisma';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes the provided callback within a Prisma transaction.
   * Useful for performing multiple writes that must succeed or fail together.
   *
   * @param callback The function to execute within the transaction context.
   * @param options Transaction options (isolation level, max wait, timeout).
   * @returns The result of the callback.
   */
  async runInTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: Parameters<PrismaService['$transaction']>[1],
  ): Promise<T> {
    return this.prisma.$transaction(callback, options);
  }
}
