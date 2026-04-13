// src/todo/todo.controller.ts
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
  UseGuards,
  Request,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFilterDto } from './dto/todo-filter.dto';
import { Todo } from './entities/todo.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { PaginationResponse } from '../common/interfaces/pagination-response.interface';

@ApiTags('todos')
@Controller('todos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(TodoValidationPipe)
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.create(createTodoDto, req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER, Role.GUEST) // All authenticated users can view todos
  @ApiOperation({ summary: 'Get filtered and paginated todos' })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered and paginated todos',
  })
  @ApiQuery({ type: TodoFilterDto })
  async findAll(
    @Request() req,
    @Query() filterDto: TodoFilterDto,
  ): Promise<PaginationResponse<Todo>> {
    return this.todoService.findAll(req.user.id, filterDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER, Role.GUEST) // All authenticated users can view a specific todo
  @ApiOperation({ summary: 'Get a specific todo by ID' })
  @ApiResponse({ status: 200, description: 'Returns the todo' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.findOne(id, req.user.id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(TodoValidationPipe)
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 204, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<void> {
    return this.todoService.remove(id, req.user.id);
  }
}
