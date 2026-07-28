import { Module, Global } from '@nestjs/common';
import { WorkspaceContextController } from './controllers/workspace-context.controller';
import { WorkspaceResolverService } from './services/workspace-resolver.service';
import { WorkspaceSessionService } from './services/workspace-session.service';
import { ContextFactory } from './providers/context.factory';
import { ContextProvider } from './providers/context.provider';
import { WorkspaceModule } from '../workspace/workspace.module';

@Global()
@Module({
  imports: [WorkspaceModule],
  controllers: [WorkspaceContextController],
  providers: [WorkspaceResolverService, WorkspaceSessionService, ContextFactory, ContextProvider],
  exports: [WorkspaceResolverService, WorkspaceSessionService, ContextFactory, ContextProvider],
})
export class WorkspaceContextModule {}
