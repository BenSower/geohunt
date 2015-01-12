var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('login');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.get('/create-task', function(req, res) {
  res.render('create-task');
});

router.get('/start', function(req, res) {
  res.render('start');
});

module.exports = router;