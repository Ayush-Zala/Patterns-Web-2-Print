import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@patterns/prisma';

/**
 * BaseRepository provides essential database helpers without imposing
 * strict generic CRUD boundaries. Services should use these helpers
 * in conjunction with their specific repository implementations.
 */
export abstract class BaseRepository {
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * Executes operations in a transaction.
   */
  async runInTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: Parameters<PrismaService['$transaction']>[1],
  ): Promise<T> {
    return this.prisma.$transaction(callback, options);
  }

  /**
   * Generates pagination query parameters for Prisma.
   */
  protected getPaginationParams(limit = 10, offset = 0) {
    return {
      take: limit,
      skip: offset,
    };
  }

  /**
   * Returns a where clause condition to filter out soft-deleted records.
   */
  protected isActive() {
    return {
      deletedAt: null,
    };
  }

  /**
   * Returns a where clause condition to find soft-deleted records.
   */
  protected isDeleted() {
    return {
      deletedAt: { not: null },
    };
  }

  /**
   * Returns an update payload for soft deleting a record.
   */
  protected softDelete() {
    return {
      deletedAt: new Date(),
    };
  }

  /**
   * Returns an update payload for restoring a soft-deleted record.
   */
  protected restore() {
    return {
      deletedAt: null,
    };
  }
}
