exports.up = function(knex) {
    return knex.schema.createTable('dailies', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('note');
      table.integer('difficulty');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('clicks').defaultTo(0);
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.boolean('ischeck').defaultTo(false);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('dailies');
  };
  