import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RecordatoriosService } from './recordatorios.service';

@Module({
  imports: [ScheduleModule.forRoot()], // Habilita los cron jobs
  providers: [RecordatoriosService],
})
export class RecordatoriosModule {}