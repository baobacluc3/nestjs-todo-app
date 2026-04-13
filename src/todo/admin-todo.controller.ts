import {
  Controller,
  Get,
  Delete,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

import { Role } from '../user/enums/role.enum';

@Controller('admin/todos')
export class AdminTodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get(':id')
  async getTodoById(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.todoService.findOneForAdmin(id);
  }

  @Put(':id')
  async updateAnyTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.updateForAdmin(id, updateTodoDto);
  }

  @Delete(':id')
  async deleteAnyTodo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todoService.removeForAdmin(id);
  }
}
