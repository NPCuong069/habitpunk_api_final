const knex = require('knex');

const knexConfig = {
    client: 'pg',
    connection: {
      database: 'Habitpunk',
      user: 'postgres',
      password: 'Bunoi123'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/migrations'
    }
};

const db = knex(knexConfig);

module.exports = db;
