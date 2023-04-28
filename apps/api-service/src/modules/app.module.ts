import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { ConfigurationModule } from '../config/configuration.module';
import dbConfig from '../config/db.config';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigType<typeof dbConfig>) => config,
      inject: [dbConfig.KEY],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
