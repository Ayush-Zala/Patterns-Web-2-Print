import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { User as UserInterface } from '@patterns/types';

@Injectable()
export class IdentityMapper {
  toPublicResponse(entity: UserEntity): Partial<UserInterface> {
    const { passwordHash, tokenVersion, deletedAt, ...publicUser } = entity;

    return publicUser;
  }
}
