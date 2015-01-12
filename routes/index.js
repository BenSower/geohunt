'use strict';
var express = require('express'),
    router = express.Router(),
    passport = require('passport');


router.get('/', function(req, res) {
    res.render('index');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/start');
    });

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/start', ensureAuthenticated, function(req, res) {
  res.render('start');
});


router.get('/create-task', ensureAuthenticated, function(req, res) {
    res.render('create-task');
});

router.get('/logout', ensureAuthenticated, function(req, res) {
      req.logout();
      res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


module.exports = router;
