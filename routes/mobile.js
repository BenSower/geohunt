'use strict';
var express = require('express'),
    router = express.Router(),
    ensureAuthenticated = require('../backend/PassportHelper').ensureAuthenticated;

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res) {
    res.render('welcome', { loggedIn: 'true'});
});

router.get('/game', ensureAuthenticated,  function(req, res) {
    res.render('game', { loggedIn: 'true'});
});


module.exports = router;
