import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { ConfigModule } from '@nestjs/config';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CryptoUtils } from './messages/CryptoUtils/CryptoUtils';

@Module({
  imports: [
    MessagesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    WhatsappModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [CryptoUtils],
})
export class AppModule {}

