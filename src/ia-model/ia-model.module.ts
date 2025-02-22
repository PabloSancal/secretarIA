import { Module } from '@nestjs/common';
import { IaModelService } from './ia-model.service';
import { UsersService } from 'src/users/users.service';
import { MessagesService } from 'src/messages/messages.service';
import { ConfigModule } from '@nestjs/config';
import { CryptoUtils } from 'src/messages/CryptoUtils/CryptoUtils';

@Module({
  imports: [ConfigModule, IaModelModule],
  providers: [IaModelService, UsersService, MessagesService, CryptoUtils],
  exports: [IaModelService]
})
export class IaModelModule { }
