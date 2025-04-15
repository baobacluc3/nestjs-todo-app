// src/migrations/1681234569999-AddCategoryToTodos.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryToTodos1681234569999 implements MigrationInterface {
  name = 'AddCategoryToTodos1681234569999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create categories table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "description" varchar,
        "color" varchar,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "UQ_categories_name" UNIQUE ("name")
      )
    `);

    // Add categoryId to todos table
    await queryRunner.query(`
      ALTER TABLE "todos" ADD COLUMN "categoryId" integer
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_categoryId" ON "todos" ("categoryId")
    `);

    // Add PRAGMA for foreign keys if needed
    await queryRunner.query(`PRAGMA foreign_keys=OFF`);
    
    // Create temp table with new schema
    await queryRunner.query(`
      CREATE TABLE "temp_todos" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "title" varchar NOT NULL,
        "description" text,
        "completed" boolean NOT NULL DEFAULT (0),
        "dueDate" datetime,
        "priority" varchar NOT NULL DEFAULT ('normal'),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "userId" integer NOT NULL,
        "categoryId" integer,
        CONSTRAINT "FK_todos_users" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_todos_categories" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL
      )
    `);

    // Copy data
    await queryRunner.query(`
      INSERT INTO "temp_todos" ("id", "title", "description", "completed", "dueDate", "priority", "createdAt", "updatedAt", "userId")
      SELECT "id", "title", "description", "completed", "dueDate", "priority", "createdAt", "updatedAt", "userId"
      FROM "todos"
    `);

    // Drop old table
    await queryRunner.query(`DROP TABLE "todos"`);

    // Rename temp table
    await queryRunner.query(`ALTER TABLE "temp_todos" RENAME TO "todos"`);

    // Recreate indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_title" ON "todos" ("title")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_userId" ON "todos" ("userId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_categoryId" ON "todos" ("categoryId")
    `);

    // Insert default categories
    await queryRunner.query(`
      INSERT INTO "categories" ("name", "color") VALUES 
      ('Work', '#FF5733'),
      ('Personal', '#33FF57'),
      ('Study', '#3357FF'),
      ('Health', '#F033FF')
    `);

    // Re-enable foreign keys
    await queryRunner.query(`PRAGMA foreign_keys=ON`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Disable foreign keys
    await queryRunner.query(`PRAGMA foreign_keys=OFF`);
    
    // Create temp table without categoryId
    await queryRunner.query(`
      CREATE TABLE "temp_todos" (
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

    // Copy data without categoryId
    await queryRunner.query(`
      INSERT INTO "temp_todos" ("id", "title", "description", "completed", "dueDate", "priority", "createdAt", "updatedAt", "userId")
      SELECT "id", "title", "description", "completed", "dueDate", "priority", "createdAt", "updatedAt", "userId"
      FROM "todos"
    `);

    // Drop original table
    await queryRunner.query(`DROP TABLE "todos"`);

    // Rename temp table
    await queryRunner.query(`ALTER TABLE "temp_todos" RENAME TO "todos"`);

    // Recreate indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_title" ON "todos" ("title")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_todos_userId" ON "todos" ("userId")
    `);

    // Drop categories table
    await queryRunner.query(`DROP TABLE "categories"`);

    // Re-enable foreign keys
    await queryRunner.query(`PRAGMA foreign_keys=ON`);
  }
}