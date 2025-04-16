// src/migrations/1681234567890-InitialMigration.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1681234567890 implements MigrationInterface {
  name = 'InitialMigration1681234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "email" varchar UNIQUE NOT NULL,
        "username" varchar NOT NULL,
        "password" varchar NOT NULL,
        "role" varchar NOT NULL DEFAULT ('user'),
        "avatarUrl" varchar,
        "bio" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "lastLoginAt" datetime
      )
    `);

    // Create index on users.email
    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email")
    `);

    // Create todos table
    await queryRunner.query(`
      CREATE TABLE "todos" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "title" varchar NOT NULL,
        "description" text,
        "completed" boolean NOT NULL DEFAULT (0),
        "dueDate" datetime,
        "priority" varchar NOT NULL DEFAULT ('normal'),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "userId" integer NOT NULL,
        CONSTRAINT "FK_todos_users" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    // Create indexes on todos table
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_title" ON "todos" ("title")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_userId" ON "todos" ("userId")
    `);

    // Create todo_tags table
    await queryRunner.query(`
      CREATE TABLE "todo_tags" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "color" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "todoId" integer NOT NULL,
        CONSTRAINT "FK_todo_tags_todos" FOREIGN KEY ("todoId") REFERENCES "todos" ("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_todo_tags_name_todoId" UNIQUE ("name", "todoId")
      )
    `);

    // Create indexes on todo_tags table
    await queryRunner.query(`
      CREATE INDEX "IDX_todo_tags_name" ON "todo_tags" ("name")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_todo_tags_todoId" ON "todo_tags" ("todoId")
    `);

    // Create todo_comments table
    await queryRunner.query(`
      CREATE TABLE "todo_comments" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "content" text NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "todoId" integer NOT NULL,
        "userId" integer,
        CONSTRAINT "FK_todo_comments_todos" FOREIGN KEY ("todoId") REFERENCES "todos" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_todo_comments_users" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL
      )
    `);

    // Create indexes on todo_comments table
    await queryRunner.query(`
      CREATE INDEX "IDX_todo_comments_todoId" ON "todo_comments" ("todoId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_todo_comments_userId" ON "todo_comments" ("userId")
    `);

    // Create admin user
    await queryRunner.query(`
      INSERT INTO "users" ("email", "username", "password", "role") 
      VALUES ('admin@example.com', 'admin', '$2b$10$uAa4NiaUCQp.EitR1YPoV.T7Hd1xNPVr95T2SwldcWmPN.ODbqPRi', 'admin')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "todo_comments"`);
    await queryRunner.query(`DROP TABLE "todo_tags"`);
    await queryRunner.query(`DROP TABLE "todos"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}