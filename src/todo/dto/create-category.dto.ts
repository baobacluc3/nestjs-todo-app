// src/todo/dto/create-category.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Work',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'Work-related tasks and projects',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Color for the category (hex code)',
    example: '#FF5733',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;
}