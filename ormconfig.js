// ormconfig.js
module.exports = {
    type: 'sqlite',
    database: 'todo-db.sqlite',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
      migrationsDir: 'src/migrations',
    },
    synchronize: false, // Set to false in production - use migrations instead
    logging: true,
  };