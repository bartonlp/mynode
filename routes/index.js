/* index.js */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const dns = require('dns');
const request = require('request');

const utilfunctions = require("./utilfunctions.js");
const query = utilfunctions.query;
const count = utilfunctions.count;
const mtime = utilfunctions.mtime;
const run = utilfunctions.run;
const robots = utilfunctions.robots;

var args = {
  copyright: "2017 Barton Phillips",
  author: "Barton Phillips http://www.bartonphillips.com",
  address: "2701 Amhurst Blvd. #12A, New Bern, North Carolina 28562",
  desc: "node.js example",
  msg: "Counter Reset: Feb. 4, 2017",
  site: "Node",
};

/* GET home page. */

router.get(['/','/index(\.(html|php))?'], function(req, res, next) {
  const port = req.headers.host.match(/:(.*)/)[1];
  args.footer = req.cnt;

  return run(function *(resume) {
    try {
      var address = yield   dns.lookup('bartonphillips.dyndns.org', resume);
      console.log("ADDRESS:", address);
    
      var admin = yield request.get('http://www.bartonlp.com/adminsites.txt', resume);
      args.adminStuff = admin.body;
      //console.log("adminStuff: ", args.adminStuff);
    } catch(err) {
      console.log("NOT bartonphillips.dyndns.org");
    }
  
    var sql = "select filename, site, ip, agent, count, concat(date(lasttime), ' ', time(lasttime)) as lasttime "+
              "from barton.counter where lasttime>current_date() order by lasttime desc";

    query(sql, function(err, result) {
      if(err) {
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
      });
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
      var views = yield fs.readFile("views.old/index.jade", resume);
      var how = yield fs.readFile("views.old/howitworks.jade", resume);
      var layout = yield fs.readFile("views.old/layout.jade", resume);
      var utils = yield fs.readFile("routes/utilfunctions.js", resume);
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
      code3: utils,
      code4: views,
      code5: how,
      code6: layout,
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

// Markdown

router.get('/markdown', function(req, res, next) {
  args.mtime = mtime('markdown');
  args.footer = req.cnt;

  res.render("markdown", {
    args: args,
  });
});

module.exports = router;
