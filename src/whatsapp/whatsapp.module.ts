import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [MessagesModule],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
  ],
  exports: [WhatsappService],
})
export class WhatsappModule { }
