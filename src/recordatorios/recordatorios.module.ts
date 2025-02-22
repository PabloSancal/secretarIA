import { Module } from '@nestjs/common';
import { RecordatoriosService } from './recordatorios.service';

@Module({
  providers: [RecordatoriosService]
})
export class RecordatoriosModule {}
