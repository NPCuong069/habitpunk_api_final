exports.up = function(knex) {
    return knex.schema.createTable('party', function(table) {
      table.increments('id').primary();
      table.integer('leader_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.string('name').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('party');
  };
  