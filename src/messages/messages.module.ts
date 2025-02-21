import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { CryptoUtils } from './CryptoUtils/CryptoUtils';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MessagesController],
  providers: [MessagesService, CryptoUtils],
  exports: [MessagesService, CryptoUtils],
})
export class MessagesModule { }
