import { Injectable } from '@nestjs/common';
import { User } from '@patterns/prisma';
import { UserResponseDto, UserSummaryDto, UserProfileDto } from '../dto';

@Injectable()
export class UserMapper {
  toResponse(entity: User): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      displayName: entity.displayName,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toSummary(entity: User): UserSummaryDto {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      status: entity.status,
    };
  }

  toProfile(entity: User): UserProfileDto {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      displayName: entity.displayName,
      phone: entity.phone,
      avatarUrl: entity.avatarUrl,
      avatarFilename: entity.avatarFilename,
      avatarMimeType: entity.avatarMimeType,
      avatarSize: entity.avatarSize,
    };
  }
}
