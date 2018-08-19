
exports.up = function(knex, Promise) {
    let createQuery = `CREATE TABLE customer(
    _id SERIAL PRIMARY KEY NOT NULL,
    customer_id TEXT,
    name TEXT,
    email TEXT,
    token TEXT,
    password_digest TEXT,
    config jsonb,
    created_at TIMESTAMP
  )`;
    return knex.raw(createQuery);
};

exports.down = function(knex, Promise) {
    let dropQuery = `DROP TABLE customer`;
    return knex.raw(dropQuery);
};
