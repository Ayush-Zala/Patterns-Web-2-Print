import { IsEmail, IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ayush.zala@patterns247.net' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'ChangeMe123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
