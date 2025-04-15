// src/todo/pipes/todo-validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Injectable()
export class TodoValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    // Perform custom validations on Todo DTOs
    if (metadata.metatype === CreateTodoDto) {
      return this.validateCreateTodo(value);
    }

    if (metadata.metatype === UpdateTodoDto) {
      return this.validateUpdateTodo(value);
    }

    return value;
  }

  private validateCreateTodo(todo: CreateTodoDto): CreateTodoDto {
    // Perform custom validations beyond what class-validator provides
    if (todo.title && todo.title.toLowerCase().includes('test') && !todo.description) {
      throw new BadRequestException(
        'Todos with "test" in the title must include a description',
      );
    }

    // Enforce title capitalization
    if (todo.title) {
      todo.title = this.capitalizeFirstLetter(todo.title);
    }

    return todo;
  }

  private validateUpdateTodo(todo: UpdateTodoDto): UpdateTodoDto {
    // Perform custom validations for updates
    if (todo.title) {
      todo.title = this.capitalizeFirstLetter(todo.title);
    }

    return todo;
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}