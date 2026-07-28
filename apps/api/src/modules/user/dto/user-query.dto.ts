import { IsOptional, IsString, IsInt, Min, Max, IsIn, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@patterns/prisma';
import { USER_CONSTANTS } from '../constants/user.constants';

export class UserQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = USER_CONSTANTS.PAGINATION.DEFAULT_PAGE;

  @ApiPropertyOptional({ example: 20, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(USER_CONSTANTS.PAGINATION.MAX_LIMIT)
  limit: number = USER_CONSTANTS.PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Search term for email, firstName, lastName, or displayName',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({ enum: UserStatus, description: 'Filter by user status' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ example: 'createdAt', description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  @IsIn(USER_CONSTANTS.SORTING.ALLOWED_SORT_FIELDS)
  sort: string = USER_CONSTANTS.SORTING.DEFAULT_SORT;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'desc', description: 'Sort order' })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  @Transform(({ value }) => value?.toLowerCase())
  order: 'asc' | 'desc' = USER_CONSTANTS.SORTING.DEFAULT_ORDER as 'asc' | 'desc';
}
