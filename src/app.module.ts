// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { PublicModule } from './public/public.module';
import { Todo } from './todo/entities/todo.entity';
import { User } from './user/entities/user.entity';
import { AppGuardProviders } from './app.guard-provider';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ThrottleMiddleware } from './common/middleware/throttle.middleware';
import { DatabaseModule } from './database/database.module';
import environment from './config/environment';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      load: [environment],
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    // Database
    DatabaseModule,
    
    // Feature modules
    TodoModule,
    UserModule,
    AuthModule,
    CommonModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...AppGuardProviders,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply logger middleware to all routes
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    
    // Apply throttle middleware to auth routes (login and register)
    consumer
      .apply(ThrottleMiddleware)
      .forRoutes(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST }
      );
  }
}