exports.up = function(knex) {
    return knex.schema.createTable('chat', function(table) {
      table.increments('id').primary();
      table.integer('party_id').unsigned().references('id').inTable('party').onDelete('CASCADE');
      table.text('content');
      table.string('user_id').unsigned().nullable().references('firebase_uid').inTable('users').onDelete('SET NULL');
      table.timestamp('time').defaultTo(knex.fn.now());
      table.boolean('is_deleted').defaultTo(false); // Adding a column to flag if the message is deleted

    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('chat');
  };
  