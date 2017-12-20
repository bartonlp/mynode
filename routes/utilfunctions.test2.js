/* Utility Functions */

const mysql = require('promise-mysql2');
//const fs = require('await-fs');
//const fs = require('fs');
const promise = require('bluebird');
const fs = promise.promisifyAll(require('fs'));
//console.log("fs:", fs);

// Do a mysql query

const query = function(sql, value) {
  // First we must return from createConnection()
  return mysql.createConnection({
    // We are useing LOCALHOST not bartonlp.com!
    host: "localhost",
    user: "barton",
    password: "7098653",
    //socketPath: "/var/run/mysqld/mysqld.sock", // for local host,
    database: "barton",
  }).then(conn => {
    //console.log("sql: %s, value: %s", sql, value);
    // Now we need to return from query
    return conn.query(sql, value).then(([rows]) => {
      conn.end();
      return rows; // This returns the array of RowDataPackets
    });
  });
}
             
exports.query = query;

// This seems like a really silly way to do this but using a 'try insert
// catch update' just didn't work. I tried everything I could think of.
// I was always left with a hanging promise if the insert failed.

exports.robots = async function(site, req) {
  var agent = req.headers['user-agent'];
  var ip = req._remoteAddress.replace(/::.*?:/, '');
  var robotsFile = site+".robots.txt";

  var who = await query("select who from barton.bots where ip=? and agent=?", [ip, agent]);
  who = (typeof who[0] === 'undefined') ? '' : who[0].who;

  if(!who) {
    who = site;
  }

  if(who.indexOf(site) == -1) {
    who += ', ' + site;
  }

  var result = await query("insert into barton.bots (ip, agent, count, robots, who, "+
                           "creation_time, lasttime) "+
                           "values(?, ?, 1, 1, ?, now(), now()) "+
                           "on duplicate key update agent=?, robots=robots | 2, who=?, "+
                           "count=count+1, lasttime=now()", [ip, agent, site, agent, who]);
  
  return fs.readFileAsync(robotsFile, 'utf8')
}

