/* Utility Functions */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Do a mysql query

const query = async function(sql, value=null) {
  const connection = await mysql.createConnection({
    host:'localhost', user: 'barton', password: '7098653'
  });
  // query database
  const [rows, fields] = await connection.query(sql, value);
  await connection.end();
  return rows;
};

// Count the number of hits. Bots and Bots2

const count = async function(req) {
  //var site = req.originalUrl.match(/^\/applitec/i) == null ? 'Node' : 'Applitec';
  //var file = req.originalUrl.match(/^.*?(\/.*)$/)[1];

  //var agent = req.headers['user-agent'];
  //var ip = req.ip.replace(/::.*?:/, '');

  const agent = "Mozilla test something";
  const ip = "75.108.73.143";
  const file = "test.html";
  const site = "TestSite";
  
  var sql = "insert into barton.counter (filename, site, ip, agent, count, lasttime) "+
            "values(?, ?, ?, ?, 1, now()) "+
            "on duplicate key update site=?, ip=?, agent=?, count=count+1, lasttime=now()";

  var value = [ file, site, ip, agent, site, ip, agent ];

  await query(sql, value);

  sql = "select count(*) as one from information_schema.tables "+
        "where (table_schema = 'barton') and (table_name = 'bots')";

  var ok = (await query(sql))[0].one;
    //ok = ok[0].one;

  if(ok == 1) {
    var x = await query("select ip from barton.bots where ip='"+ip+"'");

    var isBot = x.length == 0 ? false:  true;

    var isBot = agent.match(/\+*http.?:\/\/|Googlebot-Image|python|java|wget|nutch|perl|libwww|lwp-trivial|curl|PHP\/|urllib|GT::WWW|Snoopy|MFC_Tear_Sample|HTTP::Lite|PHPCrawl|URI::Fetch|Zend_Http_Client|http client|PECL::HTTP/i)
                || isBot;

    if(isBot) {
      try {
        // Bots has primary key(ip, agent)
        await query("insert into barton.bots (ip, agent, count, robots, who, creation_time, lasttime) "+
                    "values(?, ?, 1, 4, ?, now(), now())", [ip, agent, site]);
      } catch(err) {
        if(err.errno == 1062) { // duplicate key
          var who = (await query("select who from barton.bots where ip=? and agent=?", [ip, agent]))[0].who;

          if(!who) {
            who = site;
          }

          if(who.indexOf(site) == -1) {
            who += ', ' + site;
          }

          await query("update barton.bots set robots=robots | 8, who=?, "+
                      "count=count+1, lasttime=now() "+
                      "where ip=? and agent=?", [who, ip, agent]);
        }
      }
    }

    sql = "select count(*) as one from information_schema.tables "+
          "where (table_schema = 'barton') and (table_name = 'bots2')";

    var ok = (await query(sql))[0].one;

    if(ok == 1) {
      if(isBot) {
        // Bots2 has primary key (ip, agent, date, site, which)
        await query("insert into barton.bots2 (ip, agent, date, site, which, count, lasttime) "+
                    "values(?, ?, current_date(), ?, 2, 1, now()) "+
                    "on duplicate key update count=count+1, lasttime=now()",
                    [ip, agent, site]);
      }
    }
  }

  sql = "select count(*) as one from information_schema.tables "+
        "where (table_schema = 'barton') and (table_name = 'tracker')";

  var ok = (await query(sql))[0].one;
  //ok = ok[0].one;

  if(ok == 1) {
    var java = 0;

    if(isBot) {
      java = 0x2000; // This is the robots tag
    }

    // tracker key is id

    await query("insert into barton.tracker (site, page, ip, agent, starttime, isJavaScript, lasttime) "+
                "values(?, ?, ?, ?, now(), ?, now())",
                [site, file, ip, agent, java]);

    //$this->LAST_ID = $this->getLastInsertId();
  }

  sql = "select count(*) as one from information_schema.tables "+
        "where (table_schema = 'barton') and (table_name = 'daycounts')";

  var ok = (await query(sql))[0].one;
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

    await query(sql, [site, real, bots, real, bots]);
  }

  sql = "select count from barton.counter where site=? and filename=?";
  value = [ site, file ];
  var result = await query(sql, value);

  var cnt = result[0].count;
  return cnt;
};

// Get last modified time

const mtime = function(pugfile) {
  // we are using the views.jade which has .jade not .pug files
  // Note: mtime has '<date> GMT-nnnn (PDT)' and we want just the (PDT)
  // after the GMT-nnnn

  var stat = String(new Date(fs.statSync(pugfile).mtime));
  return stat.replace(/GMT.*? /, '');
}

exports.robots = async function(site, req, cb) {
  var agent = req.headers['user-agent'];
  var ip = req.ip.replace(/::.*?:/, '');
  
  try {
    var result = await query("insert into barton.bots (ip, agent, count, robots, who, creation_time, lasttime) "+
                             "values(?, ?, 1, 1, ?, now(), now())", [ip, agent, site]);
  } catch(err) {
    if(err.errno == 1062) { // dup key
      var who = (await query("select who from barton.bots where ip=? and agent=?", [ip, agent]))[0].who;
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

  try {
    var robotsFile = site+".robots.txt";
    var robottxt = await fs.readFile(path.join(__dirname, robotsFile), 'utf8');
    return robottxt;
  } catch(err) {
    return err;
  }
};

//query("select * from barton.counter where site='TestSite' and
//lasttime>current_date()").then(d => console.log(d))
/*var sql = "insert into barton.counter (filename, site, ip, agent, count, lasttime) "+
          "values(?, ?, ?, ?, 1, now()) "+
          "on duplicate key update site=?, ip=?, agent=?, count=count+1, lasttime=now()";

var value = ['test.html', 'TestSite', '75.108.73.143', 'curl', 'TestSite', '75.108.73.143', 'curl'];
*/
var sql = "select * from barton.counter where site=? and lasttime>current_date()";
var value = ['TestSite'];
query(sql, value)
.then(d => console.log("d:", d))
.catch(err => console.log("err:", err));

const what = async function() {
  let r = await query("select 10 as count");
  
  return r[0].count;
};

what().then(d=>console.log('d:', d))
.catch(err =>console.log("err:", err));


count().then(d => console.log("cnt:", d))
.catch(err => console.log("err2:", err));


/*
exports.query = query;
exports.count = count;
exports.mtime = mtime;
*/