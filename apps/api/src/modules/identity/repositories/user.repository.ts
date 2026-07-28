import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@core/database/repositories/base.repository';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { User, Prisma, UserStatus } from '@patterns/prisma';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(protected override readonly prisma: PrismaService) {
    super(prisma);
  }

  async findActiveUser(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        status: UserStatus.ACTIVE,
        ...this.isActive(),
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        ...this.isActive(),
      },
    });
  }

  async findByIdWithDeleted(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        ...this.isActive(),
      },
    });
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        email,
        ...this.isActive(),
      },
    });
    return count > 0;
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
        lastActivityAt: new Date(),
      },
    });
  }

  async updateLastActivity(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      where: {
        ...where,
        ...this.isActive(),
      },
      orderBy,
    } as any);
  }

  async search(query: string, skip = 0, take = 20): Promise<User[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      where: {
        ...this.isActive(),
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({
      where: {
        ...where,
        ...this.isActive(),
      },
    });
  }

  async softDelete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: this.getSoftDeletePayload(),
    });
  }

  async restore(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: this.getRestorePayload(),
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async updateProfile(
    id: string,
    data: {
      displayName?: string;
      phone?: string;
      avatarUrl?: string;
      avatarFilename?: string;
      avatarMimeType?: string;
      avatarSize?: number;
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
