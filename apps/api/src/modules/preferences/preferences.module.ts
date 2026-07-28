import { Module } from '@nestjs/common';
import { PreferencesService } from './services/preferences.service';
import { PreferencesController } from './controllers/preferences.controller';

@Module({
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule {}
