/* applitec.js Main routing for all applitec/... items */

const express = require('express');
const router = express.Router();

const utilfunctions = require("./utilfunctions.js");
const query = utilfunctions.query;
const count = utilfunctions.count;
const mtime = utilfunctions.mtime;
const run = utilfunctions.run;
const robots = utilfunctions.robots;

const email = require('emailjs');

var args = {
  copyright: "2016 Applied Technology Resources Inc.",
  title: "Applitec Inc.",
  author: "Barton Phillips",
  desc: "a test program",
  msg: "Content Reset Sep. 20, 2016",
  site: "Applitec",
};

/* GET applitec page. */

router.get('/', function(req, res, next) {
  args.mtime = mtime('applitec'); // This does a synctonous fs.statSync()
  args.footer = req.cnt; // Get cnt from req from above router.use()

  res.render('applitec', {
    args: args,
  });
});

// Sitemap

router.get('/sitemap', function(req, res, next) {
  args.mtime = mtime('sitemap');
  args.footer = req.cnt;

  res.render('sitemap', {
    args: args,
  });
});

// AtriBio

router.get('/atribio', function(req, res, next) {
  args.mtime = mtime('atribio');
  args.footer = req.cnt;
  
  res.render('atribio', {
    args: args
  });
});

// Reference

router.get('/reference', function(req, res, next) {
  args.mtime = mtime("reference");
  args.footer = req.cnt;
  
  var sql = "select company, contact, description from applitecdotcom.refs where status='active'";
  var dl = '';

  query(sql, function(err, result) {
    if(err) {
      next(err);
      return;
    }
    for(var i=0; i<result.length; ++i) {
      var company = result[i].company;
      var contact = result[i].contact;
      var desc = result[i].description;
      
      dl += "<dt>"+company+": "+contact+"</dt>"+
                "<dd>"+desc+"</dd>";
    }
    dl = "<dl>"+dl+"</dl>";

    res.render("reference", {
      args: args,
      dl: dl
    });
  });
});

// Contact Us main page

router.get('/contactus', function(req, res, next) {
  args.mtime = mtime("contactus");
  args.footer = req.cnt;
  
  res.render("contactus", {
    args: args
  });
});

// Contact Us POST

router.post('/contactuspost', function(req, res, next) {
  args.mtime = mtime("contactuspost");
  args.footer = req.cnt;
  
  var subject = req.body.subject, message = req.body.message, name = req.body.name;
  
  var server = email.server.connect({
    user: "bartonphillips@gmail.com", 
    password: "7098653Blp", 
    host: "smtp.gmail.com",
    port: 465,
    ssl: true,
  });

  // send the message and get a callback with an error or details of
  // the message that was sent

  var msg = {
    text: message.replace(/<.*?>/g, ''),
    from: 'info@bartonlp.org',
    to: name,
    subject: subject,
    attachment: [ {data: message, alternative: true} ]
  };
  
  server.send(msg, function(err, message) {
    if(err) {
      console.log("send error");
      next(err);
      return;
    }
    //console.log("send: ", message);
    res.render('contactuspost', {
      args: args
    });
  });
});

// Contact Us GET form

router.get('/contactusget', function(req, res, next) {
  args.mtime = mtime("contactusget");
  args.footer = req.cnt;
  var name = req.query.name;

  res.render('contactusget', {
    args: args,
    name: name
  });
});

// About Website

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

      var counter = yield query(sql, [args.site], resume);

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

// Robots.txt

router.get("/robots.txt", function(req, res, next) {
  console.log("Robots Applitec");
  robots(args.site, req, function(err, robottxt) {
    res.send("<pre>" + robottxt + "</pre>");
    res.end();
  });
});

router.get("/test", function(req, res, next) {
  res.render('test', {
    args: args
  });
});

module.exports = router;
