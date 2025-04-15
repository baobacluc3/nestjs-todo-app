// src/todo/dto/create-todo.dto.ts
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
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
}



