import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
    });
    return this.todoRepository.save(todo);
  }

  async findAll(userId: number): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this todo');
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    const updatedTodo = this.todoRepository.merge(todo, updateTodoDto);
    return this.todoRepository.save(updatedTodo);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    await this.todoRepository.delete(id);
  }

  async findAllForAdmin(): Promise<Todo[]> {
    return this.todoRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForAdmin(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async updateForAdmin(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOneForAdmin(id);
    const updatedTodo = this.todoRepository.merge(todo, updateTodoDto);
    return this.todoRepository.save(updatedTodo);
  }

  async removeForAdmin(id: number): Promise<void> {
    const todo = await this.findOneForAdmin(id);
    await this.todoRepository.remove(todo);
  }
}
