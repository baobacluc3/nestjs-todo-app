import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database type can be 'sqlite', 'postgres', or 'mysql'
const dbType = process.env.DATABASE_TYPE || 'sqlite';
const dbName = process.env.DATABASE_NAME || 'todo-db.sqlite';

// Fix for Todo.priority enum in SQLite
// For SQLite, we'll modify the entity column types at runtime
const entityOptions = dbType === 'sqlite' ? {
  // This path transformer function modifies entity metadata for SQLite compatibility
  entitySkipConstructor: true,
  metadataTransformer: (metadata) => {
    // Find and modify enum columns to use 'varchar' instead
    if (metadata.columns) {
      metadata.columns.forEach(column => {
        if (column.type === 'enum') {
          column.type = 'varchar';
        }
      });
    }
    return metadata;
  }
} : {};

// Base configuration
const baseConfig = {
  entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/migrations/**/*{.ts,.js}')],
  subscribers: [join(__dirname, 'src/subscribers/**/*{.ts,.js}')],
  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true',
  ...entityOptions
};

// Database-specific configuration
let dataSourceConfig: any;

if (dbType === 'sqlite') {
  dataSourceConfig = {
    ...baseConfig,
    type: 'sqlite',
    database: dbName,
  };
} else if (dbType === 'postgres') {
  dataSourceConfig = {
    ...baseConfig,
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: dbName,
    ssl: process.env.NODE_ENV === 'production',
  };
} else if (dbType === 'mysql') {
  dataSourceConfig = {
    ...baseConfig,
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: dbName,
  };
} else {
  // Default to SQLite if no valid type is provided
  dataSourceConfig = {
    ...baseConfig,
    type: 'sqlite',
    database: 'todo-db.sqlite',
  };
}

// Create and export the DataSource
export const AppDataSource = new DataSource(dataSourceConfig);