import { IsString, MaxLength, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelType } from '@patterns/prisma';
import { WORKSPACE_CONSTANTS } from '../constants/workspace.constants';
import { WorkspaceSettingsDto, WorkspacePreferencesDto } from './workspace-settings.dto';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'My Workspace' })
  @IsString()
  @MaxLength(WORKSPACE_CONSTANTS.VALIDATION.MAX_NAME_LENGTH)
  @Transform(({ value }) => value?.trim())
  name!: string;

  @ApiPropertyOptional({ example: 'My main company workspace' })
  @IsOptional()
  @IsString()
  @MaxLength(WORKSPACE_CONSTANTS.VALIDATION.MAX_DESCRIPTION_LENGTH)
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({ enum: ChannelType, default: ChannelType.CUSTOM })
  @IsOptional()
  @IsEnum(ChannelType)
  defaultChannel?: ChannelType;

  @ApiPropertyOptional({ type: WorkspaceSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkspaceSettingsDto)
  settings?: WorkspaceSettingsDto;

  @ApiPropertyOptional({ type: WorkspacePreferencesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkspacePreferencesDto)
  preferences?: WorkspacePreferencesDto;

  // TODO: Replace with Asset relation after Asset module
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoFilename?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoMimeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  logoSize?: number;
}
