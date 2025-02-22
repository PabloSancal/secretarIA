import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { RecordatoriosModule } from './recordatorios/recordatorios.module';
import { RecordatoriosService } from './recordatorios/recordatorios.service';
/**
 * Entry point for the NestJS application.
 */
async function bootstrap() {
  const logger = new Logger('Main'); 
  const app = await NestFactory.create(AppModule); 

  const configService = app.get(ConfigService); 
  const port = configService.get<number>('PORT', 3015); 

  app.get(RecordatoriosService);

  await app.listen(port); 

  logger.log(`SecretarIA running on PORT ${port}`); 
}

bootstrap();
