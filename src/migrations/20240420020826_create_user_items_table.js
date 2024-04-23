exports.up = function(knex) {
    return knex.schema.createTable('user_items', function(table) {
      table.increments('id').primary();
      table.string('userid').unsigned().references('firebase_uid').inTable('users').onDelete('CASCADE');
      table.integer('itemid').unsigned().references('id').inTable('items').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('user_items');
  };
  