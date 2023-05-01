import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import dbConfig from './db.config';
import stockServiceConfig from './stock-service.config';
import authConfig from './auth.config';
import mailConfig from './mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, stockServiceConfig, authConfig, mailConfig],
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().valid('sqlite').required(),
        DB_NAME: Joi.string().required(),
        STOCK_SERVICE_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().required(),
        RESET_LINK_URL: Joi.string().uri(),
      }),
    }),
  ],
})
export class ConfigurationModule {}
