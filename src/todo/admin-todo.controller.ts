// src/todo/admin-todo.controller.ts
import { Controller, Get, Delete, Put, Param, Body, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFilterDto } from './dto/todo-filter.dto';
import { Todo } from './entities/todo.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { PaginationResponse } from '../common/interfaces/pagination-response.interface';

@ApiTags('admin/todos')
@Controller('admin/todos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminTodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todos (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all todos' })
  async getAllTodos(@Query() filterDto: TodoFilterDto): Promise<PaginationResponse<Todo>> {
    return this.todoService.findAllForAdmin(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific todo by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns the todo' })
  async getTodoById(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.todoService.findOneForAdmin(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update any todo (Admin only)' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  async updateAnyTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.updateForAdmin(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete any todo (Admin only)' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  async deleteAnyTodo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todoService.removeForAdmin(id);
  }
}