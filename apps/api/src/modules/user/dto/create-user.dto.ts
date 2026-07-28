import {
  IsEmail,
  IsString,
  IsOptional,
  MaxLength,
  IsEnum,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserStatus } from '@patterns/prisma';
import { USER_CONSTANTS } from '../constants/user.constants';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@patterns.com' })
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character',
  })
  password!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MaxLength(USER_CONSTANTS.VALIDATION.MAX_NAME_LENGTH)
  @Transform(({ value }) => value?.trim())
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MaxLength(USER_CONSTANTS.VALIDATION.MAX_NAME_LENGTH)
  @Transform(({ value }) => value?.trim())
  lastName!: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(USER_CONSTANTS.VALIDATION.MAX_NAME_LENGTH)
  @Transform(({ value }) => value?.trim())
  displayName?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(USER_CONSTANTS.VALIDATION.MAX_PHONE_LENGTH)
  phone?: string;

  @ApiPropertyOptional({ example: 'https://storage.patterns.com/avatar.png' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'avatar.png' })
  @IsOptional()
  @IsString()
  avatarFilename?: string;

  @ApiPropertyOptional({ example: 'image/png' })
  @IsOptional()
  @IsString()
  avatarMimeType?: string;

  @ApiPropertyOptional({ example: 102400 })
  @IsOptional()
  avatarSize?: number;

  @ApiPropertyOptional({ enum: UserStatus, default: UserStatus.ACTIVE })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
