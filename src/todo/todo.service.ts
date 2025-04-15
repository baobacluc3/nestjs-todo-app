// src/todo/todo.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFilterDto } from './dto/todo-filter.dto';
import { Todo } from './entities/todo.entity';
import { PaginationResponse } from '../common/interfaces/pagination-response.interface';
import { TodoTagRepository } from './repositories/todo-tag.repository';
import { TodoRepository } from './repositories/todo.repository';
import { TodoTag } from './entities/todo-tag.entity';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly todoTagRepository: TodoTagRepository,
    private readonly connection: Connection, // Add this for transactions

  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    // Extract tags from DTO
    const { tags, ...todoData } = createTodoDto;
    
    // Create todo first
    const todo = await this.todoRepository.create(todoData, userId);
    
    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        await this.todoTagRepository.createTag(todo.id, tagName);
      }
      
      // Reload todo with tags
      return this.findOne(todo.id, userId);
    }
    
    return todo;
  }

  async findAll(
    userId: number, 
    filterDto: TodoFilterDto
  ): Promise<PaginationResponse<Todo>> {
    return this.todoRepository.findAll(userId, filterDto);
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id, ['tags', 'comments', 'category']);
    
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
    // First check if the todo exists and belongs to the user
    await this.findOne(id, userId);
    
    // Handle tags separately
    const { tags, ...todoData } = updateTodoDto;
    
    // Update todo data
    await this.todoRepository.update(id, todoData);
    
    // Handle tags if provided
    if (tags !== undefined) {
      // Remove existing tags
      await this.todoTagRepository.removeByTodoId(id);
      
      // Add new tags
      if (tags.length > 0) {
        for (const tagName of tags) {
          await this.todoTagRepository.createTag(id, tagName);
        }
      }
    }
    
    // Return updated todo with tags
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    // First check if the todo exists and belongs to the user
    await this.findOne(id, userId);
    
    // Delete the todo (tags will be deleted via cascade)
    await this.todoRepository.remove(id);
  }

  async findByTag(tagName: string, userId: number): Promise<Todo[]> {
    return this.todoRepository.findByTag(tagName, userId);
  }

  async getStats(userId: number): Promise<any> {
    const [completionStats, categoryStats] = await Promise.all([
      this.todoRepository.getCompletionStats(userId),
      this.todoRepository.countTodosByCategory(userId),
    ]);
    
    return {
      completion: completionStats,
      byCategory: categoryStats,
    };
  }

  // Admin methods
  async findAllForAdmin(filterDto: TodoFilterDto): Promise<PaginationResponse<Todo>> {
    // For admin, we don't filter by userId
    const { userId, ...restFilters } = filterDto as any;
    return this.todoRepository.findAll(null, restFilters);
  }

  async findOneForAdmin(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id, ['tags', 'comments', 'category', 'user']);
    
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    return todo;
  }

  async updateForAdmin(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    // First check if the todo exists
    await this.findOneForAdmin(id);
    
    // Handle tags separately
    const { tags, ...todoData } = updateTodoDto;
    
    // Update todo data
    await this.todoRepository.update(id, todoData);
    
    // Handle tags if provided
    if (tags !== undefined) {
      // Remove existing tags
      await this.todoTagRepository.removeByTodoId(id);
      
      // Add new tags
      if (tags.length > 0) {
        for (const tagName of tags) {
          await this.todoTagRepository.createTag(id, tagName);
        }
      }
    }
    
    // Return updated todo with tags
    return this.findOneForAdmin(id);
  }

  async removeForAdmin(id: number): Promise<void> {
    // First check if the todo exists
    await this.findOneForAdmin(id);
    
    // Delete the todo (tags will be deleted via cascade)
    await this.todoRepository.remove(id);
  }


   /**
   * Bulk create todos in a transaction
   * All todos succeed or all fail together
   */
   async createBulk(createTodoDtos: CreateTodoDto[], userId: number): Promise<Todo[]> {
    // Use a transaction to ensure all operations succeed or fail together
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const todos: Todo[] = [];
      
      // Process each todo in the transaction
      for (const createTodoDto of createTodoDtos) {
        const { tags, ...todoData } = createTodoDto;
        
        // Create todo using the transaction
        const todo = queryRunner.manager.create(Todo, {
          ...todoData,
          userId,
        });
        
        const savedTodo = await queryRunner.manager.save(todo);
        
        // Create tags if provided
        if (tags && tags.length > 0) {
          for (const tagName of tags) {
            const tag = queryRunner.manager.create(TodoTag, {
              todoId: savedTodo.id,
              name: tagName,
            });
            
            await queryRunner.manager.save(tag);
          }
        }
        
        todos.push(savedTodo);
      }
      
      // Commit transaction if everything succeeded
      await queryRunner.commitTransaction();
      
      // Return todos with their tags
      return Promise.all(todos.map(todo => this.findOne(todo.id, userId)));
    } catch (error) {
      // Rollback transaction if something failed
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  /**
   * Move todos from one category to another in a transaction
   */
  async moveTodosToCategory(
    todoIds: number[],
    targetCategoryId: number,
    userId: number,
  ): Promise<void> {
    // Verify user owns all todos
    for (const todoId of todoIds) {
      await this.findOne(todoId, userId);
    }
    
    // Use transaction for the bulk update
    const queryRunner = this.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Todo)
        .set({ categoryId: targetCategoryId })
        .where('id IN (:...ids)', { ids: todoIds })
        .andWhere('userId = :userId', { userId })
        .execute();
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  
}