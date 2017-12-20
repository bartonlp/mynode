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
  var robotsFile = site+".robots.txt";

  console.log("try insert");
/*  var result = query("insert into barton.bots (ip, agent, count, robots, who, creation_time, lasttime) "+
                     "values(?, ?, 1, 1, ?, now(), now())", [ip, agent, site]);
*/
   
    var result = await query("select current_date() as date");
    result.then(() => {
    console.log("then robotsFile:", robotsFile);
    return async function() {
      var ret = fs.readFileAsync(robotsFile, 'utf8');
      console.log("read:", ret);
      return ret;
    }
  }).catch(err => {
    console.log("async 1:", err);

    return async function(err) {
      console.log("async 2:", err);

      if(err.errno == 1062) {
        console.log("catch dup key:", err.errno);

        var who = await query("select who from barton.bots where ip=? and agent=?", [ip, agent]);
        who = who[0].who;
        console.log("Who:", who);
      
        if(!who) {
          who = site;
        }

        if(who.indexOf(site) == -1) {
          who += ', ' + site;
        }

        result = await query("update barton.bots set robots=robots | 2, who=?, "+
                             "count=count+1, lasttime=now() "+
                             "where ip=? and agent=?", [who, ip, agent]);

        console.log("result2:", result);

        return fs.readFileAsync(robotsFile, 'utf8')
      } else {
        console.log("something else:", err);
        return err;
      }
    }
  });
}

