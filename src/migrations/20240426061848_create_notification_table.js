exports.up = function(knex) {
    return knex.schema
      .createTable('notifications', table => {
        table.increments('id').primary();
        table.string('user_id').unsigned().notNullable().references('firebase_uid').inTable('users');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.string('device_type').notNullable();
        table.string('content').notNullable();
        table.integer('daily_id').unsigned().references('id').inTable('dailies').onDelete('CASCADE');
        table.boolean('is_sent').notNullable();
        table.time('scheduled_time').notNullable().defaultTo('09:00:00');
      });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('notifications');
  };