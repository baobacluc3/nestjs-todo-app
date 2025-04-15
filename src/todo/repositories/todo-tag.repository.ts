// src/todo/repositories/todo-tag.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoTag } from '../entities/todo-tag.entity';

@Injectable()
export class TodoTagRepository {
  constructor(
    @InjectRepository(TodoTag)
    private readonly todoTagRepository: Repository<TodoTag>,
  ) {}

  async findByTodoId(todoId: number): Promise<TodoTag[]> {
    return this.todoTagRepository.find({
      where: { todoId },
    });
  }

  async findAll(): Promise<TodoTag[]> {
    return this.todoTagRepository.find();
  }

  async findUniqueTagNames(): Promise<string[]> {
    const tags = await this.todoTagRepository
      .createQueryBuilder('tag')
      .select('DISTINCT tag.name', 'name')
      .getRawMany();
    
    return tags.map(tag => tag.name);
  }

  async findPopularTags(limit: number = 10): Promise<{ name: string; count: number }[]> {
    return this.todoTagRepository
      .createQueryBuilder('tag')
      .select('tag.name', 'name')
      .addSelect('COUNT(tag.id)', 'count')
      .groupBy('tag.name')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async createTag(todoId: number, name: string, color?: string): Promise<TodoTag> {
    const tag = this.todoTagRepository.create({
      todoId,
      name,
      color,
    });
    return this.todoTagRepository.save(tag);
  }

  async removeTag(id: number): Promise<void> {
    await this.todoTagRepository.delete(id);
  }

  async removeByTodoId(todoId: number): Promise<void> {
    await this.todoTagRepository.delete({ todoId });
  }
}