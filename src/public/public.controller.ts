import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { TodoService } from '../todo/todo.service';
import { Todo } from '../todo/entities/todo.entity';

@Controller('public')
export class PublicController {
  constructor(private readonly todoService: TodoService) {}

  @Get('todos/featured')
  async getFeaturedTodos(): Promise<Todo[]> {
    return [
      {
        id: 0,
        title: 'Getting Started with NestJS',
        description: 'Learn the basics of NestJS framework',
        completed: false,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null,
      },
      {
        id: 0,
        title: 'Implement JWT Authentication',
        description: 'Add secure JWT authentication to your API',
        completed: false,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null,
      },
    ];
  }

  @Get('status')
  getStatus() {
    return {
      status: 'OK',
      timestamp: new Date(),
      message: 'Todo API is up and running',
    };
  }
}
