import { Module } from '@nestjs/common';
import { WorkspaceController } from './controllers/workspace.controller';
import { WorkspaceService } from './services/workspace.service';
import { WorkspaceProvisioningService } from './services/workspace.provisioning.service';
import { WorkspaceAccessService } from './services/workspace.access.service';
import { WorkspacePolicyService } from './services/workspace.policy.service';
import { WorkspaceValidatorService } from './validators/workspace.validator';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceMapper } from './mappers/workspace.mapper';

@Module({
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceProvisioningService,
    WorkspaceAccessService,
    WorkspacePolicyService,
    WorkspaceValidatorService,
    WorkspaceRepository,
    WorkspaceMapper,
  ],
  exports: [
    WorkspaceService,
    WorkspaceProvisioningService,
    WorkspaceAccessService,
    WorkspaceRepository,
    WorkspaceMapper,
  ],
})
export class WorkspaceModule {}
