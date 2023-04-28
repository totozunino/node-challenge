import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import dbConfig from './db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().valid('sqlite').required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigurationModule {}