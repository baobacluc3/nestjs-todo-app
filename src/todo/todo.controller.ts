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
import { Role } from '../user/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.create(createTodoDto, req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER, Role.GUEST)
  async findAll(@Request() req): Promise<Todo[]> {
    return this.todoService.findAll(req.user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER, Role.GUEST)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.findOne(id, req.user.id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<void> {
    return this.todoService.remove(id, req.user.id);
  }
}
