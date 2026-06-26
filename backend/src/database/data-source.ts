import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load .env so the CLI can read DB credentials outside of NestJS context
dotenv.config();

/**
 * Standalone DataSource used by TypeORM CLI for migrations.
 * Separate from the NestJS-managed connection so `npm run migration:*`
 * commands work without bootstrapping the full app.
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'store_rating_db',
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') 
       ? { rejectUnauthorized: false } 
       : false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
