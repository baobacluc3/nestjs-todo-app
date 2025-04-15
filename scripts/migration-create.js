// scripts/migration-create.js
/**
 * This script creates a new migration file with the current timestamp
 * Usage: node scripts/migration-create.js MyMigrationName
 */
const fs = require('fs');
const path = require('path');

// Get migration name from command line args
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  console.error('Usage: node scripts/migration-create.js MyMigrationName');
  process.exit(1);
}

// Create timestamp
const timestamp = Date.now();

// Format migration name with PascalCase
const formattedName = migrationName
  .replace(/[^a-zA-Z0-9]/g, ' ')
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join('');

const className = `${formattedName}${timestamp}`;
const fileName = `${timestamp}-${formattedName}`;

// Migration template
const template = `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${className} implements MigrationInterface {
  name = '${className}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // TODO: Implement migration up
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: Implement migration down
  }
}
`;

// Make sure migrations directory exists
const migrationsDir = path.join(__dirname, '../src/migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Write migration file
const filePath = path.join(migrationsDir, `${fileName}.ts`);
fs.writeFileSync(filePath, template);

console.log(`Migration created: ${filePath}`);