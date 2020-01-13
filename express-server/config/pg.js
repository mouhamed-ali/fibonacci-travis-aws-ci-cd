// the postgres configuration file
const { Pool } = require("pg"),
  keys = require("../keys");

// create the postgres client
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
  password: keys.pgPassword
});

pgClient.on("error", () => console.log("Lost the Postgres connection"));

// in this table we will store all requests indexes (values will be stored only in the redis database)
pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

module.exports = pgClient;
