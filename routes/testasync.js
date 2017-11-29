/* Utility Functions */

const mysql = require('mysql');
const pool = require('../routes/createpool.js').pool;

// Do a mysql query

var query = function(sql, value) {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, con) {
      if(err) {
        console.log('Error connecting to Db');
        reject("Error "+ err);
      }

      // the query takes two aruments and a callback function.
      // sql is the sql statement
      // and value (if any) is the values for the sql statement whiich has
      // the form 'select count from barton.counter where site=?'
      con.query(sql, value, function(err, result) {
        if(err) {
          reject(err);
        }
        con.release();
        resolve(result);
      });
    });
  });
}

exports.query = query;

