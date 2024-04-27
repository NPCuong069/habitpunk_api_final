exports.up = function(knex) {
    return knex.schema
      .createTable('user_device_tokens', table => {
        table.increments();
        table.string('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.firebase_uid').onDelete('CASCADE');
        table.string('device_token').notNullable();
        table.timestamps(true, true);
        table.unique(['user_id', 'device_token']);
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('user_device_tokens');
  };