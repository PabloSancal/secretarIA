import { Module } from '@nestjs/common';
import { IaModelService } from './ia-model.service';
import { UsersService } from 'src/users/users.service';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  controllers: [],
  providers: [IaModelService, UsersService, MessagesService],
})
export class IaModelModule {}
