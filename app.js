// BLP 2017-03-07 -- This is a nodjs experment. It creates the
// www.bartonlp.org:7000 webpage.

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const count = require('./routes/utilfunctions.js').count;

// get the routing unit

const routes = require('./routes/index');
const app = express();

// view engine setup

// NOTE we are using 'views.old' which is the 'jade' implementation not
// 'view' which uses 'pug'!!

app.set('views', path.join(__dirname, 'views.old'));
app.set('view engine', 'jade');

//app.use(logger(...)); // Logs info to the console.log in 'development' mode

app.use(logger('[:date[clf]] :remote-addr :remote-user :method :url :status :res[content-length] ":user-agent"'));

// Catch all

app.use(function(req, res, next) {
  if(req.hostname != 'www.bartonlp.org') {
    console.log("headers.host: ", req.headers.host);
    console.log("Hostname: ", req.hostname);
    console.log("Org Url: %s, Url: %s", req.originalUrl, req.url);
    console.log("ERROR: Return");
    next(new Error('Bad Route'));
  }
  next();
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

// Now override this with the 'routes' to .../routes/index.js

app.use('/', routes);

// Set the document root to 'public'

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png'))); // favicon.png is a sprocket icon.

// catch 404 and forward to error handler

app.use(function(req, res, next) {
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
  app.use(function(err, req, res, next) {
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
  console.log("MSG: %s", err.message);
  console.log("URL: %s", req.url);
  console.log("ERROR: ", err);
  
  res.render('error', {
    message: err.message,
    url: req.url,
    status: err.status,
    error: {}
  });
});

module.exports = app;
