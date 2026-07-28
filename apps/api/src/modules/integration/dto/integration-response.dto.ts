import { ApiProperty } from '@nestjs/swagger';
import { IntegrationStatus, IntegrationType } from '@patterns/prisma';

export class IntegrationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  workspaceId!: string;

  @ApiProperty({ enum: IntegrationType })
  type!: IntegrationType;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ enum: IntegrationStatus })
  status!: IntegrationStatus;

  @ApiProperty()
  configuration!: any;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
