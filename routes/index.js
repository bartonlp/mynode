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
      var address = yield dns.lookup('bartonphillips.dyndns.org', resume);
      console.log("ADDRESS:", address);
    
      //var admin = yield request.get('http://www.bartonlp.com/adminsites.txt', resume);
      //args.adminStuff = admin.body;
      //console.log("adminStuff: ", args.adminStuff);
    } catch(err) {
      console.log("NOT bartonphillips.dyndns.org");
    }

    args.title = 'Node.js';
    args.banner = "Node.js Page";
    args.port = port;
    args.mtime = mtime("index");
    //console.log("mtime: "+args.mtime);
      
    res.render('index', {
      args: args,
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
      var views = yield fs.readFile("views.jade/index.jade", resume);
      var how = yield fs.readFile("views.jade/howitworks.jade", resume);
      var layout = yield fs.readFile("views.jade/layout.jade", resume);
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

// Make a restfull path

router.get('/getdb/:ip', function(req, res, next) {
  var resorg = res;
  request.post("http://www.bartonlp.org/ipcountry.php", {json: true, form: {ip: req.params.ip}},
               function(err, res, body) {
    if (!err && res.statusCode === 200) {
      if(body.name == "-") {
        body.name = "<span style='color: red'>was Not Found</span>";
      } else {
        body.name = "is from the <b><i>"+body.name+"</i></b>";
      }
      //console.log("body: ", body);

      resorg.render('getdb', {args: {body, args}});
    } 
  });
});

module.exports = router;
