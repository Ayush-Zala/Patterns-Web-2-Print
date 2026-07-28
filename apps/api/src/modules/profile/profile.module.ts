import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
