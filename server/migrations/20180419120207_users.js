exports.up = function (knex, Promise) {
    return knex.schema.createTable("users", table => {
        table.increments('id').primary();
        table.float('googleId')
        table.text('email');
        table.text('name');
        table.text('picture');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};