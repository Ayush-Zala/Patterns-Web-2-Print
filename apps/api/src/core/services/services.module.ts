import { Global, Module } from '@nestjs/common';
import { SlugService } from './slug.service';
import { CodeGeneratorService } from './code-generator.service';
import { MailService } from './mail.service';

@Global()
@Module({
  providers: [SlugService, CodeGeneratorService, MailService],
  exports: [SlugService, CodeGeneratorService, MailService],
})
export class ServicesModule {}
