// src/todo/services/category.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category with this name already exists
    const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
    
    if (existingCategory) {
      throw new ConflictException(`Category with name '${createCategoryDto.name}' already exists`);
    }
    
    return this.categoryRepository.create(createCategoryDto);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // Check if category exists
    const category = await this.findOne(id);
    
    // If name is being updated, check for duplicates
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByName(updateCategoryDto.name);
      
      if (existingCategory) {
        throw new ConflictException(`Category with name '${updateCategoryDto.name}' already exists`);
      }
    }
    
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number): Promise<void> {
    // Check if category exists
    await this.findOne(id);
    
    await this.categoryRepository.remove(id);
  }
}