import { ApiProperty } from '@nestjs/swagger';
import { WorkspaceStatus, ChannelType } from '@patterns/prisma';
import { WorkspaceSettingsDto, WorkspacePreferencesDto } from './workspace-settings.dto';

export class WorkspaceResponseSummary {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  publicId!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ required: false, nullable: true })
  description!: string | null;

  @ApiProperty({ enum: WorkspaceStatus })
  status!: WorkspaceStatus;

  @ApiProperty({ enum: ChannelType })
  defaultChannel!: ChannelType;

  // Logo fields
  @ApiProperty({ required: false, nullable: true })
  logoUrl!: string | null;

  @ApiProperty({ required: false, nullable: true })
  logoFilename!: string | null;

  @ApiProperty({ required: false, nullable: true })
  logoMimeType!: string | null;

  @ApiProperty({ required: false, nullable: true })
  logoSize!: number | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class WorkspaceDetailResponse extends WorkspaceResponseSummary {
  @ApiProperty({ type: WorkspaceSettingsDto })
  settings!: WorkspaceSettingsDto;

  @ApiProperty({ type: WorkspacePreferencesDto })
  preferences!: WorkspacePreferencesDto;

  @ApiProperty()
  ownerId!: string;

  @ApiProperty({ required: false, nullable: true })
  lastActivityAt!: Date | null;
}
