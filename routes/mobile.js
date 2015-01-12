'use strict';
var express = require('express'),
    router = express.Router(),
    ensureAuthenticated = require('../backend/PassportHelper').ensureAuthenticated;


var parameters = { loggedIn: 'false'};

/* GET home page. */
router.get('/',  function(req, res) {
    res.render('welcome');
});

router.get('/game',   function(req, res) {
    res.render('game');
});

router.get('/group',  function(req, res) {
    res.render('group');
});

module.exports = router;
