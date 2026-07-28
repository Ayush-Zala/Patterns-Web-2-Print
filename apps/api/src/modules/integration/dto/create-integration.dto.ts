import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IntegrationType } from '@patterns/prisma';

export class CreateIntegrationDto {
  @ApiProperty({
    description: 'The type of the integration',
    enum: IntegrationType,
    example: IntegrationType.NATIVE_WEBSITE,
  })
  @IsEnum(IntegrationType)
  @IsNotEmpty()
  type!: IntegrationType;

  @ApiProperty({
    description: 'Display name for the integration',
    example: 'My WordPress Site',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName!: string;
}
