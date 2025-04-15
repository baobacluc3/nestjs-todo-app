// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('app.database');
        const nodeEnv = configService.get('app.nodeEnv');
        
        // Base configuration
        const config = {
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/../migrations/*{.ts,.js}'],
          cli: {
            migrationsDir: 'src/migrations',
          },
          synchronize: nodeEnv !== 'production' && dbConfig.synchronize,
          logging: dbConfig.logging,
        };
        
        // Database-specific configuration
        if (dbConfig.type === 'sqlite') {
          return {
            ...config,
            type: 'sqlite',
            database: dbConfig.database,
          };
        } else if (dbConfig.type === 'postgres') {
          return {
            ...config,
            type: 'postgres',
            host: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
            ssl: nodeEnv === 'production',
          };
        } else if (dbConfig.type === 'mysql') {
          return {
            ...config,
            type: 'mysql',
            host: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
          };
        }
        
        // Default to SQLite if no valid type is provided
        return {
          ...config,
          type: 'sqlite',
          database: dbConfig.database || 'todo-db.sqlite',
        };
      },
    }),
  ],
})
export class DatabaseModule {}