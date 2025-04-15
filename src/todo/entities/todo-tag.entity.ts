// src/todo/entities/todo-tag.entity.ts
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn,
    CreateDateColumn,
    Index,
    Unique
  } from 'typeorm';
  import { Todo } from './todo.entity';
  
  @Entity('todo_tags')
  @Unique(['name', 'todoId']) // Prevent duplicate tags for the same todo
  export class TodoTag {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @Index() // Add index for tag name searches
    name: string;
  
    @Column({ nullable: true })
    color: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    // Relation with Todo - many tags can belong to one todo
    @ManyToOne(() => Todo, todo => todo.tags, {
      onDelete: 'CASCADE' // When todo is deleted, delete associated tags
    })
    @JoinColumn({ name: 'todoId' })
    todo: Todo;
  
    @Column()
    @Index() // Add index for foreign key
    todoId: number;
  }