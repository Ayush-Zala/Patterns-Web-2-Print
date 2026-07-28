import { IsString, IsBoolean, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkspaceThemeDto {
  @ApiProperty({ example: 'UTC' })
  @IsString()
  timezone!: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  currency!: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  language!: string;

  @ApiProperty({ example: 'YYYY-MM-DD' })
  @IsString()
  dateFormat!: string;

  @ApiProperty({ example: 'HH:mm' })
  @IsString()
  timeFormat!: string;
}

export class WorkspaceBrandingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  favicon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryColor?: string;
}

export class WorkspaceStorageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bucket?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;
}

export class WorkspaceNotificationDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  email!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  sms!: boolean;
}

export class WorkspaceFeaturesDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  editorEnabled!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  shopifyEnabled!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  wordpressEnabled!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  apiEnabled!: boolean;
}

export class WorkspaceSettingsDto {
  @ApiProperty({ type: WorkspaceThemeDto })
  @ValidateNested()
  @Type(() => WorkspaceThemeDto)
  theme!: WorkspaceThemeDto;

  @ApiProperty({ type: WorkspaceBrandingDto })
  @ValidateNested()
  @Type(() => WorkspaceBrandingDto)
  branding!: WorkspaceBrandingDto;

  @ApiProperty({ type: WorkspaceStorageDto })
  @ValidateNested()
  @Type(() => WorkspaceStorageDto)
  storage!: WorkspaceStorageDto;

  @ApiProperty({ type: WorkspaceNotificationDto })
  @ValidateNested()
  @Type(() => WorkspaceNotificationDto)
  notifications!: WorkspaceNotificationDto;

  @ApiProperty({ type: WorkspaceFeaturesDto })
  @ValidateNested()
  @Type(() => WorkspaceFeaturesDto)
  features!: WorkspaceFeaturesDto;
}

export class WorkspacePreferencesDto {
  // For dynamic preferences, we can't use index signatures with decorators directly in class-validator.
  // NestJS/Swagger will ignore it. Instead, we can use a record property or leave it untyped.
  [key: string]: any;
}
