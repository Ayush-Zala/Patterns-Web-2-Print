import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({ description: 'The URL to send webhook events to' })
  @IsUrl({ require_tld: false }) // false for localhost testing
  @IsNotEmpty()
  url!: string;

  @ApiProperty({ description: 'Array of event names to subscribe to' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  events!: string[];

  @ApiProperty({ description: 'Whether the webhook is initially active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
