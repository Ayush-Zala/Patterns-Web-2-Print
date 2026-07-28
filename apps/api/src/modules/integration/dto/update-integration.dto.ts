import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { IntegrationStatus } from '@patterns/prisma';

export class UpdateIntegrationDto {
  @ApiPropertyOptional({
    description: 'Display name for the integration',
    example: 'My New WordPress Site',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'The status of the integration',
    enum: IntegrationStatus,
    example: IntegrationStatus.SUSPENDED,
  })
  @IsEnum(IntegrationStatus)
  @IsOptional()
  status?: IntegrationStatus;
}
