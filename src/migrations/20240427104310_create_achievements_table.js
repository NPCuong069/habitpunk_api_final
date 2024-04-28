exports.up = function(knex) {
    return knex.schema.createTable('achievements', function(table) {
      table.string('id').primary();
      table.string('title');
      table.string('description');
      table.integer('coins');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('achievements');
  };