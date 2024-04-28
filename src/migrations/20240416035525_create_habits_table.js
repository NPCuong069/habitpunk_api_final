/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('habits', table => {
      table.increments('id').primary();
      table.string('title');
      table.text('note');
      table.integer('difficulty');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('pos_clicks');
      table.integer('neg_clicks');
      table.string('user_id').unsigned();
      table.foreign('user_id').references('firebase_uid').inTable('users');
      table.boolean('is_deleted').defaultTo(false);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('habits');
  };