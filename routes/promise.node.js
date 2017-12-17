// This uses node.js
// This file demonstrates several ways to do Promises and async/await
// to run this: node promise.node.js

// Configure to use different things

var use_songbird = false;
var use_promise = true;

var use_mysql = false;
   
if(use_songbird) {
  fs = require('fs');
  SbPromise = require('songbird');

  readFileA = async function(filename, enc) {
    let ret = await fs.promise.readFile(filename, enc);
    console.log("songbird:", ret);
    return ret;
  }
}

if(use_promise) {
  fs = require('fs'); // don't worry about loading this twice
  
  /* Here we used fs and Promise to get info from a file */

  readFileB = async function(filename, enc) {
    // we use the native Promise so no need for a require()
    
    return await new Promise(function(ok, fail) {
      fs.readFile(filename, enc, function(err, data) {
        //console.log("promise:", data);
        if(err) fail(err);
        ok(data);
      });
    });
  }
}

if(use_songbird || use_promise) {
  // We then use our readFile() to get the promise
  let ar = new Array;
  
  if(use_songbird) ar.push(readFileA);
  if(use_promise) ar.push(readFileB);

  for(let read of ar) {
    let ret = read("main.txt", 'utf8');
    ret.then(data => console.log("data:", data))
    .catch(err => {
      if(err.statusCode == '404') {
        console.log("404: Not Found");
      } else
        console.log("err", err.message);
    });
  }
}

if(use_mysql) {
  mysql = require('promise-mysql2');

  query = function(sql, value) {
    // First we must return from createConnection()
    return mysql.createConnection({
      // We are useing LOCALHOST not bartonlp.com!
      host: "bartonlp.com",
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

  var answer = query("select * from barton.counter where lasttime>current_date() "+
                     "order by lasttime limit 10");

  answer.then(rows => {
    // rows is an array of objects
    for(let row of rows) {
      // 'row' is an object so we use Object.entries() which creates
      // another array.
      for(let [key, value] of Object.entries(row)) {
        console.log("%s: %s", key, value);
      }
    }
  }).catch(err => console.log("ERROR:", err.message));
}
