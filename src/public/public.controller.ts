// src/public/public.controller.ts
import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { TodoService } from '../todo/todo.service';
import { Todo } from '../todo/entities/todo.entity';
import { CacheInterceptor } from '../common/interceptors/cache.interceptor';

@ApiTags('public')
@Controller('public')
@UseInterceptors(CacheInterceptor) // Apply caching to this controller
export class PublicController {
  constructor(private readonly todoService: TodoService) {}

  @Public()
  @Get('todos/featured')
  @ApiOperation({ summary: 'Get featured todos (public access)' })
  @ApiResponse({ status: 200, description: 'Returns featured todos' })
  async getFeaturedTodos(): Promise<Todo[]> {
    // This could be modified to return some sample or featured todos
    // For now, just returning a few sample todos
    return [
      {
        id: 0,
        title: 'Getting Started with NestJS',
        description: 'Learn the basics of NestJS framework',
        completed: false,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null
      },
      {
        id: 0,
        title: 'Implement JWT Authentication',
        description: 'Add secure JWT authentication to your API',
        completed: false,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null
      }
    ];
  }

  @Public()
  @Get('status')
  @ApiOperation({ summary: 'Get API status (public access)' })
  @ApiResponse({ status: 200, description: 'Returns API status' })
  getStatus() {
    return {
      status: 'OK',
      timestamp: new Date(),
      message: 'Todo API is up and running',
    };
  }
}