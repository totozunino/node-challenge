import { DataSource, DataSourceOptions, DatabaseType } from 'typeorm';

export const dataSourceOptions = {
  type: process.env.DB_TYPE as DatabaseType,
  database: process.env.DB_NAME,
  entities: ['src/entities/*.entity.ts'],
  migrations: ['db/migrations/*.ts'],
} as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
