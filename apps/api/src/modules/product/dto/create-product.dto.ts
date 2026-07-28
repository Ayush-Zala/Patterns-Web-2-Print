import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Price in cents' })
  @IsInt()
  @Min(0)
  price!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
