import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
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
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ThrottleMiddleware } from './common/middleware/throttle.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todo-db.sqlite',
      entities: [Todo, User],
      synchronize: true,
    }),
    TodoModule,
    UserModule,
    AuthModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
