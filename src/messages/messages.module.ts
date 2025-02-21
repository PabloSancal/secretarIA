import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { CryptoUtils } from './CryptoUtils/CryptoUtils';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, CryptoUtils],
})
export class MessagesModule { }
