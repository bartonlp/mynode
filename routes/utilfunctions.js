/* Utility Functions */

const mysql = require('mysql');
const date = require("../public/javascripts/phpdate.js").date; // Does dates like PHP
const fs = require('fs');
const dns = require('dns');

// Create the mysql connection pool

const pool = mysql.createPool({
  // We are useing LOCALHOST not bartonlp.com!
  host: "localhost", //"bartonlp.com",
  user: "barton",
  password: "7098653",
  //socketPath: "/var/run/mysqld/mysqld.sock", // for local host,
  database: "barton",
});

exports.pool = pool;

// Do a mysql query

const query = function(sql, value, cb) {
  if(typeof cb === 'undefined') {
    cb = value;
    value = null;
  }

  pool.getConnection(function(err, con) {
    if(err){
      console.log('Error connecting to Db');
      return cb(err);
    }

    con.query(sql, value, function(err, result) {
//      if(err) {
//        console.log("SQLERROR: ", err);
//      }
      con.release();
      return cb(err, result);
    });
  });
}

exports.query = query;

// run is a little helper

function run(gen, iter) {
  (iter = gen((err, data) => (err && iter.throw(err)) || iter.next(data))).next();
}

// Count the number of hits. Bots and Bots2

exports.count = function(req, cb) {
  var site = req.originalUrl.match(/^\/applitec/i) == null ? 'Node' : 'Applitec';
  //console.log("site: ", site);
  var file = req.originalUrl.match(/^.*?(\/.*)$/)[1];

  return run(function *(resume) {
    try {
      var agent = req.headers['user-agent'];
      var ip = req._remoteAddress.replace(/::.*?:/, '');

      //console.log("site: ", site);
      
      var sql = "insert into counter (filename, site, ip, agent, count, lasttime) "+
                "values(?, ?, ?, ?, 1, now()) "+
                "on duplicate key update site=?, ip=?, agent=?, count=count+1, lasttime=now()";

      var value = [ file, site, ip, agent, site, ip, agent ];

      var result = yield query(sql, value, resume);
      
      sql = "select count from barton.counter where site=? and filename=?";
      value = [ site, file ];
      var result = yield query(sql, value, resume);

      var cnt = result[0].count;

      // If its me should I count?
      // Not used yet
      //var address = yield dns.resolve4('bartonlp.org', resume);
      //console.log("ADDRESS: ", address[0]);
      
      sql = "select count(*) as one from information_schema.tables "+
            "where (table_schema = 'barton') and (table_name = 'bots')";
      
      var ok = (yield query(sql, resume))[0].one;
      //ok = ok[0].one;
      
      if(ok == 1) {
        var x = yield query("select ip from barton.bots where ip='"+ip+"'", resume);

        var isBot = x.length == 0 ? false:  true;

        var isBot = agent.match(/\+*http:\/\/|Googlebot-Image|python|java|wget|nutch|perl|libwww|lwp-trivial|curl|PHP\/|urllib|GT::WWW|Snoopy|MFC_Tear_Sample|HTTP::Lite|PHPCrawl|URI::Fetch|Zend_Http_Client|http client|PECL::HTTP/i)
                    || isBot;

        if(isBot) {
          try {
            // Bots has primary key(ip, agent)
            var result = yield query("insert into barton.bots (ip, agent, count, robots, who, creation_time, lasttime) "+
                                     "values(?, ?, 1, 4, ?, now(), now())", [ip, agent, site], resume);
          } catch(err) {
            if(err.errno == 1062) { // duplicate key
              var who = (yield query("select who from barton.bots where ip=? and agent=?", [ip, agent], resume))[0].who;
              
              if(!who) {
                who = site;
              }
              
              if(who.indexOf(site) == -1) {
                who += ', ' + site;
              }
              
              result = yield query("update barton.bots set robots=robots | 8, who=?, "+
                                   "count=count+1, lasttime=now() "+
                                   "where ip=? and agent=?", [who, ip, agent], resume);
            }
          }
        }

        sql = "select count(*) as one from information_schema.tables "+
              "where (table_schema = 'barton') and (table_name = 'bots2')";

        var ok = (yield query(sql, resume))[0].one;

        if(ok == 1) {
          if(isBot) {
            // Bots2 has primary key (ip, agent, date, site, which)
            result = yield query("insert into barton.bots2 (ip, agent, date, site, which, count, lasttime) "+
                                 "values(?, ?, current_date(), ?, 2, 1, now()) "+
                                 "on duplicate key update count=count+1, lasttime=now()",
                                 [ip, agent, site], resume);
          }
        }
      }

      sql = "select count(*) as one from information_schema.tables "+
            "where (table_schema = 'barton') and (table_name = 'tracker')";

      var ok = (yield query(sql, resume))[0].one;
      //ok = ok[0].one;

      if(ok == 1) {
        var java = 0;

        if(isBot) {
          java = 0x2000; // This is the robots tag
        }

        // tracker key is id
        
        result = yield query("insert into barton.tracker (site, page, ip, agent, starttime, isJavaScript, lasttime) "+
                             "values(?, ?, ?, ?, now(), ?, now())",
                            [site, file, ip, agent, java], resume);

        //$this->LAST_ID = $this->getLastInsertId();
      }

      sql = "select count(*) as one from information_schema.tables "+
            "where (table_schema = 'barton') and (table_name = 'daycounts')";

      var ok = (yield query(sql, resume))[0].one;
      //ok = ok[0].one;

      if(ok == 1) {
        if(isBot) {
          var bots = 1, real = 0;
        } else {
          real = 1, bots = 0;
        }
        sql = "insert into barton.daycounts (site, `date`, `real`, bots, members, visits, lasttime) "+
              "values(?, now(), ?, ?, 0, 1, now()) " +
              "on duplicate key update `real`=`real`+?, bots=bots+?, visits=visits+1, lasttime=now()";
        //console.log(sql);
        result = yield query(sql, [site, real, bots, real, bots], resume);
      }

      return cb(null, cnt);
    } catch(err) {
      return cb(err);
    }
  });
}

// Get last modified time

exports.mtime = function(pugfile) {
  return String(new Date(fs.statSync("/var/www/mynode/views/"+pugfile+".pug").mtime)).replace(/GMT.*? /, '');
}

exports.run = function(gen, iter) {
  (iter = gen((err, data) => (err && iter.throw(err)) || iter.next(data))).next();
}

exports.robots = function(site, req, cb) {
  var agent = req.headers['user-agent'];
  var ip = req._remoteAddress.replace(/::.*?:/, '');
  
  return run(function *(resume) {
    try {
      var result = yield query("insert into barton.bots (ip, agent, count, robots, who, creation_time, lasttime) "+
                               "values(?, ?, 1, 1, ?, now(), now())", [ip, agent, site], resume);
    } catch(err) {
      if(err.errno == 1062) { // dup key
        var who = (yield query("select who from barton.bots where ip=? and agent=?", [ip, agent], resume))[0].who;
        if(!who) {
          who = site;
        }

        if(who.indexOf(site) == -1) {
          who += ', ' + site;
        }

        result = yield query("update barton.bots set robots=robots | 2, who=?, "+
                             "count=count+1, lasttime=now() "+
                             "where ip=? and agent=?", [who, ip, agent], resume);
      }
    }

    try {
      var robotsFile = site+".robots.txt";
      var robottxt = yield fs.readFile("/var/www/mynode/routes/"+robotsFile, resume);
      return cb(null, robottxt);
    } catch(err) {
      return cb(err);
    }
  });
}

