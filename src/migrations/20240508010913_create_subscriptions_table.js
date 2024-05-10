exports.up = function(knex) {
    return knex.schema.createTable('subscriptions', table => {
      table.increments('id').primary();
      table.string('user_id').references('firebase_uid').inTable('users').onDelete('CASCADE');
      table.integer('num_of_months');
      table.string('status').notNullable();
      table.timestamp('start_date').defaultTo(knex.fn.now());
      table.timestamp('end_date').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('subscriptions');
  };