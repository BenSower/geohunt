'use strict';
var MongoClient = require('mongodb').MongoClient,
    config = require('../config'),
    format = require('util').format,
    express = require('express'),
    router = express.Router();


router.post('/task/create', function(req, res) {
    console.log('Adding ' + req.body.taskName + ' with location ' + req.body.location + ' to db');
    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {
        if (err) throw err;

        var collection = db.collection(config.mongodb.taskTable);
        collection.insert(req.body, function(err, docs) {
            if (err) throw err;
            res.json({
                'status': 'ok',
                '_id': docs[0]._id
            });
            db.close();
        });
    });
});

router.get('/task/read', function(req, res) {
    getAllTasks(function(tasks) {
        res.json(tasks);
    });
});

router.post('/register', function(req, res) {
    console.log('registering new user: ' + req.body.username);
    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection(config.mongodb.userTable);
        collection.insert(req.body, function(err, docs) {
            if (err) throw err;
            res.redirect('/login');
            db.close();
        });
    });
});


router.post('/game/createHunt', function(req, res) {

    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {

        var lon = req.body.lon,
            lat = req.body.lat,
            user = req.body.user;


        if (lon === undefined || lat === undefined || user === undefined) {
            console.log('Missing info in request. Query: ' + req.body);
            res.redirect('/login');
        } else {
            getTasksForLocation(lon, lat, function(tasks) {
                var newGame = {
                    'user': user,
                    'tasks': tasks,
                    'completed': 0
                };
                if (err) throw err;
                var gameTableConnection = db.collection(config.mongodb.gameTable);
                gameTableConnection.insert(newGame, function(err, docs) {
                    if (err) throw err;
                    //res.status(200).send('OK');
                    res.send(docs[0]._id);
                    db.close();
                });
            });
        }

    });
});

function getAllTasks(cb) {
    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection(config.mongodb.taskTable);
        collection.find({}).toArray(function(err2, tasks) {
            if (err) throw err;
            db.close();
            cb(tasks);
        });
    });
}

//atm only randomly selects tasks and returns them
//TODO: Do this with a correct algorithm based on lon and lat! 
function getTasksForLocation(lon, lat, cb) {
    getAllTasks(function(tasks) {
        var taskList = [],
            numbers = [];
        for (var i = 0; i < tasks.length; i++) {
            numbers[i] = i;
        }
        numbers = shuffle(numbers);

        for (var i = 0; i < 5; i++) {
            taskList[i] = tasks[numbers[i]];
        }
        cb(taskList);
    });
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


module.exports = router;
