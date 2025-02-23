import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RecordatoriosService } from './recordatorios.service';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), forwardRef(() => WhatsappModule), PrismaModule],
  providers: [RecordatoriosService],
  exports: [RecordatoriosService]
})
export class RecordatoriosModule { }