exports.up = function(knex) {
    return knex.schema.createTable('items', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('coin').defaultTo(0);
      table.string('type');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('items');
  };
  