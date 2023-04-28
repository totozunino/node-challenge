import { DataSource, DataSourceOptions, DatabaseType } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions = {
  type: process.env.DB_TYPE as DatabaseType,
  database: process.env.DB_NAME,
  entities: ['src/entities/*.entity.ts'],
  migrations: ['db/migrations/*.ts'],
} as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
