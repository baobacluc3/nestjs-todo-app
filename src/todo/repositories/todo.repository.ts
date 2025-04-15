// src/todo/repositories/todo.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../entities/todo.entity';
import { TodoFilterDto } from '../dto/todo-filter.dto';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { PaginationResponse } from '../../common/interfaces/pagination-response.interface';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
    });
    return this.todoRepository.save(todo);
  }

  async findAll(
    userId: number | null,
    filterDto: TodoFilterDto,
  ): Promise<PaginationResponse<Todo>> {
    const { page=1, limit, completed, search, sortBy, sortOrder, categoryId } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.tags', 'tags')
      .leftJoinAndSelect('todo.category', 'category')
      .where('todo.userId = :userId', { userId });

    if (completed !== undefined) {
      queryBuilder.andWhere('todo.completed = :completed', { completed });
    }

    if (categoryId) {
      queryBuilder.andWhere('todo.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(todo.title LIKE :search OR todo.description LIKE :search OR tags.name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy(`todo.${sortBy}`, sortOrder);
    queryBuilder.skip(skip).take(limit);

    const [items, totalItems] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

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

  async findOne(id: number, relations: string[] = []): Promise<Todo | null> {
    return this.todoRepository.findOne({
      where: { id },
      relations,
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo | null> {
    await this.todoRepository.update(id, updateTodoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }

  async findByTag(tagName: string, userId: number): Promise<Todo[]> {
    return this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.tags', 'tags')
      .where('todo.userId = :userId', { userId })
      .andWhere('tags.name = :tagName', { tagName })
      .getMany();
  }

  async countTodosByCategory(userId: number): Promise<any[]> {
    return this.todoRepository
      .createQueryBuilder('todo')
      .leftJoin('todo.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(todo.id)', 'count')
      .where('todo.userId = :userId', { userId })
      .groupBy('category.name')
      .getRawMany();
  }

  async getCompletionStats(userId: number): Promise<{ completed: number; total: number }> {
    const total = await this.todoRepository.count({ where: { userId } });
    const completed = await this.todoRepository.count({
      where: { userId, completed: true },
    });

    return { completed, total };
  }
}