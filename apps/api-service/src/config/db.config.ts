import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';

const DB_CONFIG = 'DB_CONFIG';

export default registerAs(DB_CONFIG, () => {
  return {
    type: process.env.DB_TYPE as DatabaseType,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
  } as Partial<TypeOrmModuleOptions>;
});
