'use strict';
var MongoClient = require('mongodb').MongoClient,
    config = require('../config'),
    express = require('express'),
    ObjectID = require('mongodb').ObjectID,
    router = express.Router(),
    TASKS_PER_GAME = 4;


router.post('/task/create', function(req, res) {
    console.log('Adding ' + req.body.taskName + ' with location ' + req.body.location + ' to db');
    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {
        if (err) throw err;
        //console.log(req.body);
        var collection = db.collection(config.mongodb.taskTable);
        collection.ensureIndex({
            'location': '2dsphere'
        }, function(err) {
            if (err) throw err;
        });

        var lon = parseFloat(req.body.location[0]);
        var lat = parseFloat(req.body.location[1]);

        collection.insert({
            taskName: req.body.taskName,
            userId: req.body.userId,
            completeCount: req.body.completeCount,
            assignCount: req.body.assignCount,
            riddleText: req.body.riddleText,
            hints: req.body.hints,
            location: {
                type: 'Point',
                coordinates: [lon, lat],
                category: 'task'
            }
        }, function(err, docs) {
            if (err) throw err;
            res.send('OK');
        });

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

        var lon = parseFloat(req.body.lon),
            lat = parseFloat(req.body.lat),
            user = req.body.user;


        if (lon === undefined || lat === undefined || user === undefined) {
            console.log('Missing info in request. Query: ' + req.body);
            res.redirect('/login');
        } else {
            getTasksForLocation(lon, lat, function(tasks) {
                var newGame = {
                    'user': user,
                    'tasks': tasks,
                    'index': -1
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


router.get('/game/getActiveTask/:gameId', function(req, res) {
    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {
        if (err) throw err;
        var id = req.param('gameId'),
            collection = db.collection(config.mongodb.gameTable);

        collection.findOne({
            '_id': new ObjectID(id)
        }, function(err, game) {
            if (err) throw err;
            //console.log(game.tasks[game.index]._id);
            if (game.index == TASKS_PER_GAME - 1) {
                res.json({
                    'msg': 'Game Over!'
                });
            } else {
                var task = game.tasks[game.index];
                res.json({
                    'msg': 'ok',
                    'task': {
                        taskName : task.taskName,
                        riddleText: task.riddleText,
                        hint1: task.hints[0],
                        hint2:task.hints[1]
                    }
                });
            }

            db.close();
        });
    });
});

router.get('/game/taskComplete/:gameId', function(req, res) {
    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {
        var id = req.param('gameId'),
            collection = db.collection(config.mongodb.gameTable);
        collection.update({
            '_id': new ObjectID(id)
        }, {
            $inc: {
                'index': 1
            }
        }, function(err) {
            if (err) throw err;
            console.log('Successfully incremented index of game ' + id);
            res.json({
                'msg': 'ok'
            });
            db.close();
        });
    });
});



function getAllTasks(lon, lat, cb) {
    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection(config.mongodb.taskTable);
        var query = {
            'location': {
                $near: {
                    $geometry: {
                        'type': 'Point',
                        'coordinates': [lon, lat]
                    },
                    $maxDistance: 25000
                }
            }
        };
        console.log(query);
        collection.find(query).toArray(function(err, tasks) {
            if (err) throw err;
            db.close();
            cb(tasks);
        });
    });
}

//atm only randomly selects tasks and returns them
//TODO: Do this with a correct algorithm based on lon and lat! 
function getTasksForLocation(lon, lat, cb) {

    getAllTasks(lon, lat, function(tasks) {

        var taskList = [],
            numbers = [];
        for (var i = 0; i < tasks.length; i++) {
            numbers[i] = i;
        }
        numbers = shuffle(numbers);

        for (i = 0; i < TASKS_PER_GAME; i++) {
            taskList[i] = tasks[numbers[i]];
        }

        cb(taskList);
    });
}


function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


module.exports = router;
