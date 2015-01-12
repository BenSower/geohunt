'use strict';

var config = require('./config'),
    express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    PassportHelper = require('./backend/PassportHelper'),
    expressSession = require('express-session');

//Includes
var index = require('./routes/index'),
    mobile = require('./routes/mobile'),
    api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(expressSession({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(PassportHelper.authenticate);
passport.serializeUser(PassportHelper.serializeUser);
passport.deserializeUser(PassportHelper.deserializeUser);

//register static file paths
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/', index);
app.use('/mobile', mobile);
app.use('/user', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
