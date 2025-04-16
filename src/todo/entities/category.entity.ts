// src/todo/entities/category.entity.ts
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany,
    Index
  } from 'typeorm';
  import { Todo } from './todo.entity';
  
  @Entity('categories')
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    @Index()
    name: string;
  
    @Column({ nullable: true })
    description: string;
  
    @Column({ nullable: true })
    color: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relation with Todo - one category can have many todos
    @OneToMany(() => Todo, todo => todo.category)
    todos: Todo[];
  }