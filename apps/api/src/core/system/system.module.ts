import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SystemController],
})
export class SystemModule {}
