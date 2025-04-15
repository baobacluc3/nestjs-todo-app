// src/user/entities/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Todo } from '../../todo/entities/todo.entity';
import { Role } from '../enums/role.enum';
import { TodoComment } from 'src/todo/entities/todo-comment.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index() // Index for faster lookups
  email: string;

  @Column()
  username: string;

  @Column()
  @Exclude() // This will exclude the password from any response
  password: string;

  @Column({
    type: 'varchar',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  // Relation with Todo - one user can have many todos
  @OneToMany(() => Todo, todo => todo.user, {
    // Don't cascade delete - we don't want to delete a user's todos automatically
  })
  todos: Todo[];

  // Relation with TodoComment - one user can have many comments
  @OneToMany(() => TodoComment, comment => comment.user)
  comments: TodoComment[];

  // Hash password before inserting
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash the password if it was modified
    if (this.password) {
      // Check if the password is already hashed
      if (!this.password.startsWith('$2b$')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    }
  }
}