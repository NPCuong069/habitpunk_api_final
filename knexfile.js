// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
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
  },

};
