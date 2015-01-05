var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('welcome');
});

router.get('/game', function(req, res) {
  res.render('game');
});

router.get('/group', function(req, res) {
  res.render('group');
});

module.exports = router;