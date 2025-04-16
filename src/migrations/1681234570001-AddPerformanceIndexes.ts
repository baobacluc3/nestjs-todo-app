// src/migrations/1681234570001-AddPerformanceIndexes.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1681234570001 implements MigrationInterface {
  name = 'AddPerformanceIndexes1681234570001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add index for searching todos by completion status
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_todos_completed" ON "todos" ("completed")
    `);

    // Add index for searching todos by due date
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_todos_dueDate" ON "todos" ("dueDate")
    `);

    // Add index for searching todos by priority
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_todos_priority" ON "todos" ("priority")
    `);

    // Add compound index for common filtering pattern
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_todos_userId_completed_dueDate" 
      ON "todos" ("userId", "completed", "dueDate")
    `);

    // Add index for tag search optimization
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_todo_tags_name_lower" 
      ON "todo_tags" (LOWER("name"))
    `);

    // Add index for comments
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_todo_comments_createdAt" 
      ON "todo_comments" ("createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes created in the up method
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_todos_completed"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_todos_dueDate"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_todos_priority"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_todos_userId_completed_dueDate"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_todo_tags_name_lower"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_todo_comments_createdAt"`);
  }
}