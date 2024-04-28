exports.up = function(knex) {
    return knex.schema.createTable('invitations', function(table) {
      table.increments('id').primary();
      table.integer('party_id').unsigned().references('id').inTable('party');
      table.string('user_id').references('firebase_uid').inTable('users');
      table.integer('status');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('invitations');
  };