import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';

const DB_CONFIG = 'DB_CONFIG';

export default registerAs(DB_CONFIG, () => {
  return {
    type: process.env.DB_TYPE as DatabaseType,
    database: process.env.DB_NAME,
    entities: ['./entities/*.entity.ts'],
    migrations: ['src/db/migrations/*.ts'],
  } as Partial<TypeOrmModuleOptions>;
});
