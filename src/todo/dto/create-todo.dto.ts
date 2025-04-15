// src/todo/dto/create-todo.dto.ts
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsDate, IsEnum, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the todo item',
    example: 'Learn NestJS',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the todo item',
    example: 'Build a Todo API with NestJS and TypeORM',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the todo is completed',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean = false;

  @ApiProperty({
    description: 'Due date for the todo',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({
    description: 'Priority level of the todo',
    enum: ['low', 'normal', 'high'],
    default: 'normal',
    required: false,
  })
  @IsOptional()
  @IsEnum(['low', 'normal', 'high'])
  priority?: string = 'normal';

  @ApiProperty({
    description: 'Category ID for the todo',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({
    description: 'Tags for the todo',
    example: ['work', 'important'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}