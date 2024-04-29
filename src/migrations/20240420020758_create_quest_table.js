exports.up = function (knex) {
  return knex.schema.createTable('quest', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('details');
    table.integer('reward');
    table.integer('hp').defaultTo(0);
    table.integer('break').defaultTo(0);
    table.integer('xp').defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('quest');
};
