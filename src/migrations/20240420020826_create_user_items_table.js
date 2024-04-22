exports.up = function(knex) {
    return knex.schema.createTable('user_items', function(table) {
      table.increments('id').primary();
      table.integer('userid').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('itemid').unsigned().references('id').inTable('items').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('user_items');
  };
  