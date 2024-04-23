exports.up = function(knex) {
    return knex.schema.createTable('party', function(table) {
      table.increments('id').primary();
      table.string('leader_id').unsigned().references('firebase_uid').inTable('users').onDelete('SET NULL');
      table.string('name').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('party');
  };
  