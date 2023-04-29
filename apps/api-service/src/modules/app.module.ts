import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { ConfigurationModule } from '../config/configuration.module';
import dbConfig from '../config/db.config';
import { UserModule } from './user/user.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigType<typeof dbConfig>) => config,
      inject: [dbConfig.KEY],
    }),
    UserModule,
    StockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
