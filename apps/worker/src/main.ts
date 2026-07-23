import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  app.enableShutdownHooks();
  
  // Configuration and Logging initialization here
  console.log('Worker started');
}
bootstrap();
