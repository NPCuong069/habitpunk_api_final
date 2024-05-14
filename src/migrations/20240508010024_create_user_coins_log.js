exports.up = function(knex) {
    return knex.schema.createTable('user_coins_log', table => {
      table.increments('id').primary();
      table.string('user_id').references('firebase_uid').inTable('users').onDelete('CASCADE');
      table.integer('coins').notNullable().defaultTo(0);
      table.integer('daily_id').unsigned().references('id').inTable('dailies').onDelete('SET NULL').nullable();
      table.integer('habit_id').unsigned().references('id').inTable('habits').onDelete('SET NULL').nullable();
      table.timestamp('date_added').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('user_coins_log');
  };
