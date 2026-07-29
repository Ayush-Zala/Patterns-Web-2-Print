import { ApiProperty } from '@nestjs/swagger';

export class WebhookResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  workspaceId!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  events!: string[];

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class WebhookWithSecretResponseDto extends WebhookResponseDto {
  @ApiProperty({ description: 'The plain text signing secret (only returned once)' })
  secret!: string;
}

export class WebhookDeliveryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  webhookId!: string;

  @ApiProperty()
  workspaceId!: string;

  @ApiProperty()
  event!: string;

  @ApiProperty()
  attempt!: number;

  @ApiProperty({ required: false })
  responseStatus?: number;

  @ApiProperty({ required: false })
  latency?: number;

  @ApiProperty({ required: false })
  nextRetryAt?: Date;

  @ApiProperty({ required: false })
  deliveredAt?: Date;

  @ApiProperty({ required: false })
  errorMessage?: string;

  @ApiProperty()
  createdAt!: Date;
}
