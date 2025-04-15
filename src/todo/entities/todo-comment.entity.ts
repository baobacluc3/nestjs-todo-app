// src/todo/entities/todo-comment.entity.ts
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    JoinColumn,
    Index
  } from 'typeorm';
  import { Todo } from './todo.entity';
  import { User } from '../../user/entities/user.entity';
  
  @Entity('todo_comments')
  export class TodoComment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text' })
    content: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relation with Todo - many comments can belong to one todo
    @ManyToOne(() => Todo, todo => todo.comments, {
      onDelete: 'CASCADE' // When todo is deleted, delete associated comments
    })
    @JoinColumn({ name: 'todoId' })
    todo: Todo;
  
    @Column()
    @Index() // Add index for foreign key
    todoId: number;
  
    // Relation with User - many comments can belong to one user
    @ManyToOne(() => User, user => user.comments, {
      onDelete: 'SET NULL' // When user is deleted, keep comments but set userId to null
    })
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @Column({ nullable: true })
    @Index() // Add index for foreign key
    userId: number;
  }