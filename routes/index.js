/* index.js */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const utilfunctions = require("./utilfunctions.js");

const query = utilfunctions.query;
const count = utilfunctions.count;
const mtime = utilfunctions.mtime;
const run = utilfunctions.run;
const robots = utilfunctions.robots;

var args = {
  copyright: "2016 Barton Phillips",
  author: "Barton Phillips http://www.bartonphillips.com",
  desc: "node.js example",
  msg: "Counter Reset Sep 20, 2016",
  site: "Node",
};

/* GET home page. */

router.get(['/','/index(\.(html|php))?'], function(req, res, next) {
  const port = req.headers.host.match(/:(.*)/)[1];
  args.footer = req.cnt;
  
  var sql = "select filename, site, ip, agent, count, concat(date(lasttime), ' ', time(lasttime)) as lasttime "+
            "from barton.counter where lasttime>current_date() order by lasttime desc";

  query(sql, function(err, result) {
    if(err) {
      //console.log("query: ", err);
      next(err); //new Error('Error: '+err));
      return;
    };

    args.title = 'Node.js';
    args.banner = "Node.js Page";
    args.port = port;
    args.mtime = mtime("index");

    res.render('index', {
      result: result,
      args: args,
      test: 'test it'
    });
  });
});

/* GET howitworks */

router.get('/howitworks', function(req, res, next) {
  args.footer = req.cnt;
  return run(function *(resume) {
    try {
      var app = yield fs.readFile("app.js", resume);
      var index = yield fs.readFile("routes/index.js", resume);
    } catch(err) {
      return next(err); //new Error("Error: "+err));
    }
    args.title = 'How It Works';
    args.banner = 'How It Works Page';
    args.mtime = mtime("howitworks");

    res.render('howitworks', {
      args: args,
      code1: app,
      code2: index,
    });
  });
});

/* GET query */

router.get('/query', function(req, res, next) {
  args.footer = req.cnt;
  args.title = 'Query';
  args.banner = 'Query Page';
  args.mtime = mtime("query");
    
  res.render('query', {
    args: args,
    sql: ''
  });
});

/* POST query
 * params: database
 * params: sql
*/

router.post('/query', function(req, res, next) {
  args.footer = req.cnt;
  var sql = req.body.sql;
  
  query(sql, function(err, result) {
    if(err) {
      //console.log("p query: ", err);
      return next(err); //new Error(err));
    }
      
    var type;

    if(Array.isArray(result)) {
      type = "Array";
    } else {
      type = "Object";
    }

    args.title = 'Query';
    args.banner = 'Query Page';
    args.mtime = mtime("query");

    res.render('query', {
      type: type,
      sql: sql,
      result: result,
      args: args
    });
  });
});

// Robots.txt

router.get("/robots.txt", function(req, res, next) {
  console.log("Robots Node");
  robots(args.site, req, function(err, robottxt) {
    res.send("<pre>" + robottxt + "</pre>");
    res.end();
  });
});

// About website

router.get('/aboutwebsite', function(req, res, next) {
  args.mtime = mtime("aboutwebsite");
  args.footer = req.cnt;

  res.render('aboutwebsite', {
    args: args,
  });
});

// Webstats

router.get('/webstats', function(req, res, next) {
  args.mtime = mtime('webstats');
  args.footer = req.cnt;
  
  return run(function *(resume) {
    try {
      var sql = "select filename, ip, agent, count, concat(date(lasttime), ' ', time(lasttime)) as lasttime "+
                "from barton.counter "+
                "where site=? and lasttime>current_date() order by lasttime desc";

      var counter = yield query(sql, [args.site],  resume);

      sql = "select * from barton.bots where lasttime>current_date() order by lasttime desc";
      var bots = yield query(sql, resume);

      sql = "select * from barton.bots2 where lasttime>current_date() order by lasttime desc";
      var bots2 = yield query(sql, resume);

      sql = "select site, page, ip, agent, concat(date(starttime), ' ', time(starttime)) as starttime, "+
            "concat(date(endtime), ' ', time(endtime)) as endtime, hex(isJavaScript) as isJS "+
            "from barton.tracker where lasttime>current_date() order by lasttime desc";
      var tracker = yield query(sql, resume);

      sql = "select site, date_format(`date`, '%Y-%m-%d') as `date`, `real`, bots, visits, "+
            "concat(date(lasttime), ' ', time(lasttime)) as lasttime "+
            "from daycounts where lasttime>current_date() order by lasttime desc";

      var daycounts = yield query(sql, resume);

      res.render('webstats', {
        args: args,
        counter: counter,
        bots: bots,
        bots2: bots2,
        tracker: tracker,
        daycounts: daycounts,
      });
    } catch(err) {
      return next(err);
    }
  });
});

// Markdown

router.get('/markdown', function(req, res, next) {
  args.mtime = mtime('markdown');
  args.footer = req.cnt;

  res.render("markdown", {
    args: args,
  });
});

module.exports = router;
