import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const databaseUrl = (process.env.DATABASE_URL ?? '').replace(/^['"]|['"]$/g, '');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl || undefined,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/entities/*{.ts,.js}'],
  migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
  ssl: databaseUrl ? { rejectUnauthorized: false } : false,
};

export function initDataSource(): DataSourceOptions {
  return dataSourceOptions;
}

export default new DataSource(dataSourceOptions);
