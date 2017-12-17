/* Utility Functions */

const mysql = require('promise-mysql2');
const fs = require('await-fs');
//const fs = require('fs');

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

        /*
        let ret = new Array;
        for(let i=0; i<rows.length; ++i) {
           ret[i] = (Object.assign({}, rows[i]));
        }
        console.log("ROWS:", ret);
        // we could now return 'ret'
        return ret; // this returns a array of 0-n
        */
    });
  });
}
             
exports.query = query;

exports.robots = async function(site, req) {
  var agent = req.headers['user-agent'];
  var ip = req._remoteAddress.replace(/::.*?:/, '');

  try {
    //console.log("try insert");
    var result = await query("insert into barton.bots (ip, agent, count, robots, who, creation_time, lasttime) "+
                             "values(?, ?, 1, 1, ?, now(), now())", [ip, agent, site]);
  } catch(err) {
    if(err.errno == 1062) { // dup key
      //console.log("catch dup key");
      var who = await query("select who from barton.bots where ip=? and agent=?", [ip, agent]);
      who = who[0].who;
      if(!who) {
        who = site;
      }

      if(who.indexOf(site) == -1) {
        who += ', ' + site;
      }

      result = await query("update barton.bots set robots=robots | 2, who=?, "+
                           "count=count+1, lasttime=now() "+
                           "where ip=? and agent=?", [who, ip, agent]);
    }
  }

  var robotsFile = site+".robots.txt";
  /*
  var read = async function(file) {
    return await new Promise(function(ok, fail) {
      fs.readFile(file, 'utf8', function(err, data) {
        //console.log("promise:", data);
        if(err) fail(err);
        ok(data);
      });
    });
  }
  return read(robotsFile);
  */
  
  return await fs.readFile(robotsFile, 'utf8');
}
