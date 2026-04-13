import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Request() req): Promise<Todo> {
    return this.todoService.create(createTodoDto, req.user?.id ?? 1);
  }

  @Get()
  async findAll(@Request() req): Promise<Todo[]> {
    return this.todoService.findAll(req.user?.id ?? 1);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Todo> {
    return this.todoService.findOne(id, req.user?.id ?? 1);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto, req.user?.id ?? 1);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    return this.todoService.remove(id, req.user?.id ?? 1);
  }
}
