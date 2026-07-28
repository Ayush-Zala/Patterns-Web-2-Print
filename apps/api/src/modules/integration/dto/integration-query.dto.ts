import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IntegrationStatus, IntegrationType } from '@patterns/prisma';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class IntegrationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by type', enum: IntegrationType })
  @IsEnum(IntegrationType)
  @IsOptional()
  type?: IntegrationType;

  @ApiPropertyOptional({ description: 'Filter by status', enum: IntegrationStatus })
  @IsEnum(IntegrationStatus)
  @IsOptional()
  status?: IntegrationStatus;

  @ApiPropertyOptional({ description: 'Search by display name' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number = 20;
}
