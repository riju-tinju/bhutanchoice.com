var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var agentRouter = require('./routes/agent');
var bookingsRouter = require('./routes/bookings');
var settingsRouter = require('./routes/settings');
var adminAuthRouter = require('./routes/adminAuth');// custom

require("dotenv").config();// custom
const db = require("./config/connection");// custom
db.DBconnect();// custom
var app = express();

//custom
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true only with HTTPS
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', adminAuthRouter); // custom route for admin authentication
let verifyAdmin = require("./helper/verifyAdmin");// custom
app.use('/', indexRouter);//verifyAdmin,
app.use('/agent', agentRouter); 
app.use('/bookings', bookingsRouter); 
app.use('/', settingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
