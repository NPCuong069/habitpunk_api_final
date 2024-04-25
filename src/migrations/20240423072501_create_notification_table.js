exports.up = function(knex) {
    return knex.schema.createTable('notifications', table => {
      table.increments('id').primary();
      table.timestamp('time').notNullable();
      table.string('content').notNullable();
      table.integer('daily_id').unsigned().references('id').inTable('dailies').onDelete('CASCADE');
      table.boolean('status').defaultTo(false); // false indicates notification has not been pushed
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('notifications');
  };
  