exports.up = function(knex) {
    return knex.schema.createTable('party_quest', function(table) {
      table.increments('id').primary();
      table.integer('party_id').unsigned().references('id').inTable('party').onDelete('CASCADE');
      table.integer('quest_id').unsigned(); // Assuming a separate migration sets up a foreign key later
      table.integer('hp').defaultTo(0);
      table.integer('break').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('status');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('party_quest');
  };
  