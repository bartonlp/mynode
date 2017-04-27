/* Utility Functions to create the mysql pool */

const mysql = require('mysql');

const pool = mysql.createPool({
  // We are useing LOCALHOST not bartonlp.com!
  host: "localhost", //"bartonlp.com",
  user: "barton",
  password: "7098653",
  //socketPath: "/var/run/mysqld/mysqld.sock", // for local host,
  database: "barton",
});

module.exports = {
  pool
}
