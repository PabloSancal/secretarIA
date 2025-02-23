import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CryptoUtils } from './CryptoUtils/CryptoUtils';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [MessagesService, CryptoUtils],
  exports: [MessagesService, CryptoUtils],
})
export class MessagesModule { }
