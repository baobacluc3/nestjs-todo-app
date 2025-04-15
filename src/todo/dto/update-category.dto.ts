// src/todo/dto/update-category.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Updated Work',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'Updated work-related tasks and projects',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Color for the category (hex code)',
    example: '#33A1FF',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;
}