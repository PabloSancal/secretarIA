import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { IaModelModule } from 'src/ia-model/ia-model.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [MessagesModule, IaModelModule],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    UsersService,
  ],
  exports: [WhatsappService],
})
export class WhatsappModule { }
