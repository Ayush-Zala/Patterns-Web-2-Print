import { IsOptional, IsString, IsInt, Min, Max, IsIn, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkspaceStatus } from '@patterns/prisma';
import { WORKSPACE_CONSTANTS } from '../constants/workspace.constants';

export class WorkspaceQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = WORKSPACE_CONSTANTS.PAGINATION.DEFAULT_PAGE;

  @ApiPropertyOptional({ example: 20, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(WORKSPACE_CONSTANTS.PAGINATION.MAX_LIMIT)
  limit: number = WORKSPACE_CONSTANTS.PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({ description: 'Search term for name, slug, or description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({ enum: WorkspaceStatus, description: 'Filter by workspace status' })
  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus;

  @ApiPropertyOptional({ example: 'createdAt', description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  @IsIn(WORKSPACE_CONSTANTS.SORTING.ALLOWED_SORT_FIELDS)
  sort: string = WORKSPACE_CONSTANTS.SORTING.DEFAULT_SORT;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'desc', description: 'Sort order' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  @Transform(({ value }) => value?.toLowerCase())
  order: 'asc' | 'desc' = WORKSPACE_CONSTANTS.SORTING.DEFAULT_ORDER as 'asc' | 'desc';
}
