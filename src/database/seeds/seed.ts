// src/database/seeds/seed.ts
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/enums/role.enum';
import { Category } from '../../todo/entities/category.entity';
import { Todo } from '../../todo/entities/todo.entity';
import { TodoTag } from '../../todo/entities/todo-tag.entity';

async function bootstrap() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Get the DataSource from the app
  const dataSource = app.get(DataSource);

  try {
    logger.log('Starting seed...');

    // Create sample users
    await seedUsers(dataSource);
    
    // Create sample categories
    await seedCategories(dataSource);
    
    // Create sample todos with tags
    await seedTodos(dataSource);

    logger.log('Seed completed successfully');
  } catch (error) {
    logger.error(`Seed failed: ${error.message}`);
  } finally {
    await app.close();
  }
}

async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  
  // Check if users already exist
  const count = await userRepository.count();
  if (count > 0) {
    return;
  }
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await userRepository.save({
    email: 'admin@example.com',
    username: 'admin',
    password: adminPassword,
    role: Role.ADMIN,
  });
  
  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  await userRepository.save({
    email: 'user@example.com',
    username: 'user',
    password: userPassword,
    role: Role.USER,
  });
  
  // Create guest user
  const guestPassword = await bcrypt.hash('guest123', 10);
  await userRepository.save({
    email: 'guest@example.com',
    username: 'guest',
    password: guestPassword,
    role: Role.GUEST,
  });
}

async function seedCategories(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(Category);
  
  // Check if categories already exist
  const count = await categoryRepository.count();
  if (count > 0) {
    return;
  }
  
  // Create sample categories
  await categoryRepository.save([
    {
      name: 'Work',
      description: 'Work-related tasks and projects',
      color: '#FF5733',
    },
    {
      name: 'Personal',
      description: 'Personal tasks and errands',
      color: '#33FF57',
    },
    {
      name: 'Study',
      description: 'Learning and educational tasks',
      color: '#3357FF',
    },
    {
      name: 'Health',
      description: 'Health and fitness activities',
      color: '#F033FF',
    },
  ]);
}

async function seedTodos(dataSource: DataSource) {
  const todoRepository = dataSource.getRepository(Todo);
  const todoTagRepository = dataSource.getRepository(TodoTag);
  
  // Check if todos already exist
  const count = await todoRepository.count();
  if (count > 0) {
    return;
  }
  
  // Get users and categories
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  
  const adminUser = await userRepository.findOne({ where: { username: 'admin' } });
  const regularUser = await userRepository.findOne({ where: { username: 'user' } });
  
  const workCategory = await categoryRepository.findOne({ where: { name: 'Work' } });
  const personalCategory = await categoryRepository.findOne({ where: { name: 'Personal' } });
  const studyCategory = await categoryRepository.findOne({ where: { name: 'Study' } });
  
  // Make sure we have the required entities
  if (!adminUser || !regularUser || !workCategory || !personalCategory || !studyCategory) {
    throw new Error('Required entities not found for seeding todos');
  }
  
  // Create sample todos for admin
  const adminTodo1 = await todoRepository.save({
    title: 'Prepare project presentation',
    description: 'Create slides for the quarterly project presentation',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    userId: adminUser.id,
    categoryId: workCategory.id,
  });
  
  await todoTagRepository.save([
    {
      todoId: adminTodo1.id,
      name: 'presentation',
    },
    {
      todoId: adminTodo1.id,
      name: 'important',
    },
  ]);
  
  const adminTodo2 = await todoRepository.save({
    title: 'Learn TypeORM migrations',
    description: 'Study how to create and run TypeORM migrations effectively',
    completed: false,
    priority: 'normal',
    userId: adminUser.id,
    categoryId: studyCategory.id,
  });
  
  await todoTagRepository.save([
    {
      todoId: adminTodo2.id,
      name: 'learning',
    },
    {
      todoId: adminTodo2.id,
      name: 'typescript',
    },
  ]);
  
  // Create sample todos for regular user
  const userTodo1 = await todoRepository.save({
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits',
    completed: false,
    priority: 'normal',
    userId: regularUser.id,
    categoryId: personalCategory.id,
  });
  
  await todoTagRepository.save([
    {
      todoId: userTodo1.id,
      name: 'shopping',
    },
  ]);
  
  const userTodo2 = await todoRepository.save({
    title: 'Complete NestJS tutorial',
    description: 'Finish the Todo API project with authentication and database',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    userId: regularUser.id,
    categoryId: studyCategory.id,
  });
  
  await todoTagRepository.save([
    {
      todoId: userTodo2.id,
      name: 'learning',
    },
    {
      todoId: userTodo2.id,
      name: 'nestjs',
    },
  ]);
}

bootstrap();