// src/todo/todo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { AdminTodoController } from './admin-todo.controller';
import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';
import { TodoTag } from './entities/todo-tag.entity';
import { TodoComment } from './entities/todo-comment.entity';
import { CategoryService } from './services/category.service';
import { TodoRepository } from './repositories/todo.repository';
import { CategoryRepository } from './repositories/category.repository';
import { TodoTagRepository } from './repositories/todo-tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Todo,Category, TodoTag, TodoComment])],
  controllers: [TodoController,AdminTodoController,CategoryController],
  providers: [  TodoService,
    CategoryService,
    TodoRepository,
    CategoryRepository,
    TodoTagRepository,],
  exports: [TodoService,CategoryService], // Thêm dòng này để export TodoService
})
export class TodoModule {}