import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserMapper } from './mappers/user.mapper';
import { IdentityModule } from '../identity/identity.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [IdentityModule, WorkspaceModule],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports: [UserService],
})
export class UserModule {}
