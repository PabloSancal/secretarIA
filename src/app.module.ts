import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [MessagesModule,ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}

