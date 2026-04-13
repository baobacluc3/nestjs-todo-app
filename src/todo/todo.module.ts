import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { AdminTodoController } from './admin-todo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController, AdminTodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
