// src/todo/dto/todo-filter.dto.ts
import { IsOptional, IsBoolean, IsString, IsIn, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class TodoFilterDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter todos by completion status',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description: 'Search in todo title and description',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by category ID',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({
    description: 'Filter by tag names',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  tags?: string[];

  @ApiProperty({
    description: 'Filter by priority',
    required: false,
    enum: ['low', 'normal', 'high'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['low', 'normal', 'high'])
  priority?: string;

  @ApiProperty({
    description: 'Filter by due date before',
    required: false,
  })
  @IsOptional()
  @IsString()
  dueDateBefore?: string;

  @ApiProperty({
    description: 'Filter by due date after',
    required: false,
  })
  @IsOptional()
  @IsString()
  dueDateAfter?: string;

  @ApiProperty({
    description: 'Sort field',
    required: false,
    enum: ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt', 'title', 'dueDate', 'priority'])
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}