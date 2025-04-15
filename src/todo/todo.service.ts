// src/todo/todo.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFilterDto } from './dto/todo-filter.dto';
import { Todo } from './entities/todo.entity';
import { PaginationResponse } from '../common/interfaces/pagination-response.interface';

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

  async findAll(
    userId: number, 
    filterDto: TodoFilterDto
  ): Promise<PaginationResponse<Todo>> {
    const { page=1, limit=3, completed, search, sortBy='createdAt', sortOrder='DESC' } = filterDto;
    
    // Calculate skip (offset) based on page and limit
    const skip = (page - 1) * limit;
    
    // Use QueryBuilder for more complex queries
    const queryBuilder = this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.userId = :userId', { userId });
    
    // Add completed filter if provided
    if (completed !== undefined) {
      queryBuilder.andWhere('todo.completed = :completed', { completed });
    }
    
    // Add search filter if provided
    if (search) {
      queryBuilder.andWhere(
        '(todo.title LIKE :search OR todo.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    // Add sorting
    queryBuilder.orderBy(`todo.${sortBy}`, sortOrder);
    
    // Add pagination
    queryBuilder.skip(skip).take(limit);
    
    // Execute query
    const [items, totalItems] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    // Return paginated response
    return {
      items,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ 
      where: { id } 
    });
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    // Check if this todo belongs to the user
    if (todo.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this todo');
    }
    
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    
    // Update the todo with new values
    const updatedTodo = this.todoRepository.merge(todo, updateTodoDto);
    
    return this.todoRepository.save(updatedTodo);
  }

  async remove(id: number, userId: number): Promise<void> {
    // First check if the todo exists and belongs to the user
    await this.findOne(id, userId);
    
    // Then delete it
    await this.todoRepository.delete(id);
  }

  // Admin methods - can access any todo regardless of user
  async findAllForAdmin(filterDto: TodoFilterDto): Promise<PaginationResponse<Todo>> {
    const { page=1, limit=3, completed, search, sortBy, sortOrder } = filterDto;
    
    // Calculate skip (offset) based on page and limit
    const skip = (page - 1) * limit;
    
    // Use QueryBuilder for more complex queries
    const queryBuilder = this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'user'); // Join with user for admin view
    
    // Add completed filter if provided
    if (completed !== undefined) {
      queryBuilder.andWhere('todo.completed = :completed', { completed });
    }
    
    // Add search filter if provided
    if (search) {
      queryBuilder.andWhere(
        '(todo.title LIKE :search OR todo.description LIKE :search OR user.username LIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    // Add sorting
    queryBuilder.orderBy(`todo.${sortBy}`, sortOrder);
    
    // Add pagination
    queryBuilder.skip(skip).take(limit);
    
    // Execute query
    const [items, totalItems] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    // Return paginated response
    return {
      items,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOneForAdmin(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ 
      where: { id },
      relations: ['user'] // Include user relation for admin view
    });
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    return todo;
  }

  async updateForAdmin(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOneForAdmin(id);
    
    // Update the todo with new values
    const updatedTodo = this.todoRepository.merge(todo, updateTodoDto);
    
    return this.todoRepository.save(updatedTodo);
  }

  async removeForAdmin(id: number): Promise<void> {
    const todo = await this.findOneForAdmin(id);
    await this.todoRepository.remove(todo);
  }

  
}