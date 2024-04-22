exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('firebase_uid').notNullable().unique(); 
    table.string('username').notNullable().unique();
    table.string('email').unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.integer('hp').defaultTo(0);
    table.integer('xp').defaultTo(0);
    table.integer('en').defaultTo(0);
    table.integer('lvl').defaultTo(1);
    table.integer('coin').defaultTo(0);
    table.integer('hat_id').nullable();
    table.integer('costume_id').nullable();
    table.integer('facial_id').nullable();
    table.integer('weapon_id').nullable();
    table.integer('background_id').nullable();
    table.integer('pet_id').nullable();
    table.integer('cape_id').nullable();
    table.integer('chip_id').nullable();
    table.timestamp('login_time').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
