exports.up = function(knex) {
    return knex.schema.createTable('user_achievements', function(table) {
      table.increments('id').primary();
      table.string('achievement_id').unsigned().references('id').inTable('achievements');
      table.string('user_id').references('firebase_uid').inTable('users');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('user_achievements');
  };
  