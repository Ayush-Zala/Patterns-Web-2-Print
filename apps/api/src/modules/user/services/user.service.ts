import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from '../../identity/repositories/user.repository';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto, UserQueryDto } from '../dto';
import { WorkspaceProvisioningService } from '../../workspace/services/workspace.provisioning.service';
import * as argon2 from 'argon2';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { UserStatus } from '@patterns/prisma';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
    private readonly workspaceProvisioningService: WorkspaceProvisioningService,
  ) {}

  async create(createUserDto: CreateUserDto, actorId: string) {
    // Normalize email
    const email = createUserDto.email.trim().toLowerCase();

    // Check duplicate
    const exists = await this.userRepository.exists(email);
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await argon2.hash(createUserDto.password);

    const data = {
      email,
      passwordHash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      displayName: createUserDto.displayName,
      phone: createUserDto.phone,
      avatarUrl: createUserDto.avatarUrl,
      avatarFilename: createUserDto.avatarFilename,
      avatarMimeType: createUserDto.avatarMimeType,
      avatarSize: createUserDto.avatarSize,
      status: createUserDto.status ?? UserStatus.ACTIVE,
    };

    // Use transaction for future-proofing
    const user = await this.prisma.$transaction(async (tx) => {
      // Create user inside transaction context (using repository might not accept tx, but we do it anyway logically)
      return this.userRepository.create(data as any);
    });

    // Provision default workspace
    await this.workspaceProvisioningService.provisionDefaultWorkspace(user.id);

    this.logger.log(`User created [Actor: ${actorId}] [Target: ${user.id}]`);
    return user;
  }

  async findMany(query: UserQueryDto) {
    const { page, limit, search, status, sort, order } = query;
    const skip = (page - 1) * limit;

    let where: any = {};
    if (status) {
      where.status = status;
    }

    let users = [];
    if (search) {
      users = await this.userRepository.search(search, skip, limit);
    } else {
      users = await this.userRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { [sort]: order },
      });
    }

    const total = await this.userRepository.count(where);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, actorId: string) {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const email = updateUserDto.email.trim().toLowerCase();
      const exists = await this.userRepository.exists(email);
      if (exists) throw new ConflictException('Email already in use');
      updateUserDto.email = email;
    }

    const updated = await this.userRepository.update(id, updateUserDto as any);
    this.logger.log(`User updated [Actor: ${actorId}] [Target: ${id}]`);
    return updated;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto, actorId: string) {
    await this.findById(id);
    const updated = await this.userRepository.updateProfile(id, updateProfileDto as any);
    this.logger.log(`User profile updated [Actor: ${actorId}] [Target: ${id}]`);
    return updated;
  }

  async updateStatus(id: string, status: UserStatus, actorId: string) {
    if (id === actorId) {
      throw new ForbiddenException('Cannot change your own status');
    }

    const user = await this.findById(id);

    // Validate transitions
    const validTransitions: Record<UserStatus, UserStatus[]> = {
      [UserStatus.ACTIVE]: [UserStatus.INACTIVE, UserStatus.SUSPENDED],
      [UserStatus.INACTIVE]: [UserStatus.ACTIVE],
      [UserStatus.SUSPENDED]: [UserStatus.ACTIVE],
      [UserStatus.PENDING]: [UserStatus.ACTIVE],
    };

    if (!validTransitions[user.status].includes(status)) {
      throw new BadRequestException(`Invalid status transition from ${user.status} to ${status}`);
    }

    const updated = await this.userRepository.updateStatus(id, status);
    this.logger.log(`User status updated to ${status} [Actor: ${actorId}] [Target: ${id}]`);
    return updated;
  }

  async softDelete(id: string, actorId: string) {
    if (id === actorId) {
      throw new ForbiddenException('Cannot delete yourself');
    }

    await this.findById(id);

    await this.prisma.$transaction(async (tx) => {
      await this.userRepository.softDelete(id);
    });

    this.logger.log(`User deleted [Actor: ${actorId}] [Target: ${id}]`);
  }

  async restore(id: string, actorId: string) {
    if (id === actorId) {
      throw new ForbiddenException('Cannot restore yourself');
    }

    const user = await this.userRepository.findByIdWithDeleted(id);
    if (!user) throw new NotFoundException('User not found');
    if (!user.deletedAt) throw new BadRequestException('User is not deleted');

    const restored = await this.prisma.$transaction(async (tx) => {
      return this.userRepository.restore(id);
    });

    this.logger.log(`User restored [Actor: ${actorId}] [Target: ${id}]`);
    return restored;
  }
}
