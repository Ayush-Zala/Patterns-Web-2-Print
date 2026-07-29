import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StorefrontAuthDto {
  @ApiProperty({ description: 'The integration API Key' })
  @IsString()
  @IsNotEmpty()
  apiKey!: string;

  @ApiProperty({ description: 'The integration API Secret' })
  @IsString()
  @IsNotEmpty()
  apiSecret!: string;
}
