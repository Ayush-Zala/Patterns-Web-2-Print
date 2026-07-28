import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LogoutDto {
  @ApiPropertyOptional({ description: 'Logout from all devices', example: false })
  @IsBoolean()
  @IsOptional()
  allDevices?: boolean;
}
