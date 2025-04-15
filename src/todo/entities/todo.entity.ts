// src/todo/entities/todo.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  OneToMany,
  Index
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TodoTag } from './todo-tag.entity';
import { TodoComment } from './todo-comment.entity';
import { Category } from './category.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index() // Add index for better query performance
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ default: 'normal', type: 'enum', enum: ['low', 'normal', 'high'] })
  priority: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relation with User - many todos can belong to one user
  @ManyToOne(() => User, user => user.todos, { 
    onDelete: 'CASCADE', // When user is deleted, delete all their todos
    nullable: false // A todo must belong to a user
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Index() // Add index for foreign key
  userId: number;

  // Relation with Category - many todos can belong to one category
  @ManyToOne(() => Category, category => category.todos, {
    onDelete: 'SET NULL' // When category is deleted, set categoryId to null
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
  
  @Column({ nullable: true })
  @Index() // Add index for foreign key
  categoryId: number;

  // Relation with TodoTags
  @OneToMany(() => TodoTag, todoTag => todoTag.todo, {
    cascade: true // When saving a todo, save any new tags too
  })
  tags: TodoTag[];

  // Relation with TodoComments
  @OneToMany(() => TodoComment, comment => comment.todo, {
    cascade: true // When saving a todo, save any new comments too
  })
  comments: TodoComment[];
}