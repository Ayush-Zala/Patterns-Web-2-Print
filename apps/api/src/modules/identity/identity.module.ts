import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { IdentityMapper } from './mappers/identity.mapper';
import { IdentityValidator } from './validators/identity.validator';

@Module({
  providers: [UserRepository, IdentityMapper, IdentityValidator],
  exports: [UserRepository, IdentityMapper, IdentityValidator],
})
export class IdentityModule {}
