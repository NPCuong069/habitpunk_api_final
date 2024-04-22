exports.up = function(knex) {
    return knex.schema.createTable('party_users', function(table) {
      table.increments('id').primary();
      table.integer('party_id').unsigned().references('id').inTable('party').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('party_users');
  };
  