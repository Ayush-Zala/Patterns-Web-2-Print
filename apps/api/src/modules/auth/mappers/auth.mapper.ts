import { Injectable } from '@nestjs/common';
import { AuthResponse, AuthMeResponse, User } from '@patterns/types';
import { IdentityMapper } from '../../identity/mappers/identity.mapper';
import { UserEntity } from '../../identity/entities/user.entity';

@Injectable()
export class AuthMapper {
  constructor(private readonly identityMapper: IdentityMapper) {}

  toAuthResponse(accessToken: string, expiresIn: number, user?: UserEntity): AuthResponse {
    return {
      success: true,
      data: {
        accessToken,
        expiresIn,
        user: user ? (this.identityMapper.toPublicResponse(user) as any) : undefined,
      },
    };
  }

  toAuthMeResponse(user: UserEntity): AuthMeResponse {
    return {
      success: true,
      data: {
        user: this.identityMapper.toPublicResponse(user) as any,
      },
    };
  }

  toLogoutResponse() {
    return { success: true };
  }
}
