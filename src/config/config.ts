import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: ['.env'], 
      validationSchema: Joi.object({
        MESSAGE_KEY: Joi.string()
          .length(64) 
          .required(),
      }),
    }),
  ],
  exports: [ConfigModule], 
})

export class CustomConfigModule {}



