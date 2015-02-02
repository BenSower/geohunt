'use strict';
var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    ensureAuthenticated = require('../backend/PassportHelper').ensureAuthenticated;


router.get('/', function(req, res) {
    res.render('index');
});

router.get('/about', function(req, res) {
  res.render('about');
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
  res.render('start', { loggedIn: 'true'});
});


router.get('/create-task', ensureAuthenticated, function(req, res) {
    res.render('create-task', { loggedIn: 'true'});
});

router.get('/statistics', ensureAuthenticated, function(req, res) {
    res.render('statistics', { loggedIn: 'true'});
});

router.get('/logout', ensureAuthenticated, function(req, res) {
      req.logout();
      res.redirect('/');
});

module.exports = router;
