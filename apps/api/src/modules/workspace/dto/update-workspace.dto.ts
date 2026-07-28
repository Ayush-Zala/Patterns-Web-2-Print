import { PartialType, PickType } from '@nestjs/swagger';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { WorkspaceStatus } from '@patterns/prisma';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// We do NOT include 'slug' or 'code' here because they are immutable.
export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}

export class UpdateWorkspaceStatusDto {
  @ApiPropertyOptional({ enum: WorkspaceStatus })
  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status!: WorkspaceStatus;
}
