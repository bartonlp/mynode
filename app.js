// BLP 2017-03-07 -- This is a nodjs experment. It creates the
// www.bartonlp.org:7000 webpage.

const fs = require('fs');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const count = require(path.join(__dirname, 'routes/utilfunctions.js')).count;
const logger = require(path.join(__dirname, 'logger.js'));

// get the routing unit

const routes = require(path.join(__dirname, 'routes/index.js'));
const app = express();

// view engine setup

// NOTE we are using 'views.jade' which is the 'jade' implementation not
// 'view' which uses 'pug'!!

app.set('views', path.join(__dirname, 'views.jade'));
app.set('view engine', 'jade');

if(process.env.DEBUG == 'true') { // NOTE this is a string.
  app.use(morgan('combined'));
} else {
  const stream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
  app.use(morgan('combined', {stream: stream}));
}

// Catch all

app.use(function(req, res, next) {
  logger.debug("hostname: %s", req.hostname);
  
  if(req.hostname == 'www.bartonlp.org' ||
     req.hostname == 'mynode.bartonlp.org') {
    next();
  } else {
    logger.error("headers.host: %s\nHostname: %s\nOrg Url: %s, Url: %s\nERROR: Return",
                 req.headers.host, req.hostname, req.originalUrl, req.url);
    next(new Error('Bad Route'));
  }
});

/*
 * This goes before any router methods. This does the
 * counter and bots logic.
 */

app.use(function(req, res, next) {
  // Get the originalUrl and grab what is after the first / which will
  // be the name of the site jade file.

  count(req, function(err, cnt) {
    if(err) {
      next(err);
      return;
    }

    // Put the count into the req property as cnt.

    req.cnt = cnt;
    next();
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set the document root to 'public'

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png'))); // favicon.png is a sprocket icon.

// Now override this with the 'routes' to .../routes/index.js

app.use('/', routes);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  logger.debug("req: %s", req.url);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace

// To remove development mode set the 'env' to blank. Uncomment to
// disable development.
//app.set('env', '');

if(app.get('env') === 'development') {
  // Error middle ware has 4 args! Must have 'next' even if not used.
  app.use(function(err, req, res, next) {
    logger.debug("REQ: %s", req.url);
    
    res.status(err.status || 500);
    if(err.status != 404) {
      req.url = null;
    }

    res.render('error', {
      message: err.message,
      url: req.url,
      status: err.status,
      error: err
    }); 
  });
}

// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if(err.status != 404) {
    req.url = null;
  }
  logger.error("MSG: %s\nURL: %s\nERROF: %s", err.message, req.url, err);
  
  res.render('error', {
    message: err.message,
    url: req.url,
    status: err.status,
    error: {}
  });
});

module.exports = app;
