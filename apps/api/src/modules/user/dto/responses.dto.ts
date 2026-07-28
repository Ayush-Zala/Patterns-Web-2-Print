import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@patterns/prisma';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ required: false, nullable: true })
  displayName!: string | null;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class UserSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;
}

export class UserProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ required: false, nullable: true })
  displayName!: string | null;

  @ApiProperty({ required: false, nullable: true })
  phone!: string | null;

  @ApiProperty({ required: false, nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ required: false, nullable: true })
  avatarFilename!: string | null;

  @ApiProperty({ required: false, nullable: true })
  avatarMimeType!: string | null;

  @ApiProperty({ required: false, nullable: true })
  avatarSize!: number | null;
}

export class PaginationMetaDto {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  hasNext!: boolean;

  @ApiProperty()
  hasPrevious!: boolean;
}
