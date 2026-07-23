import { Controller as NestController, Get as NestGet } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { APP_NAME } from '@common/constants/app.constants';
import { ConfigService } from '@nestjs/config';
import { ROUTES } from '@common/constants/route.constants';
@ApiTags('System')
@NestController(ROUTES.SYSTEM)
export class SystemController {
  constructor(private readonly configService: ConfigService) {}

  @NestGet('info')
  @ApiOperation({ summary: 'Get system information' })
  getInfo() {
    return {
      application: APP_NAME,
      version: '1.0.0', // This could come from package.json or process.env later
      environment: this.configService.get<string>('NODE_ENV'),
      nodeVersion: process.version,
      uptime: process.uptime(),
    };
  }
}
