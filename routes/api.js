'use strict';
var MongoClient = require('mongodb').MongoClient,
    config = require('../config'),
    express = require('express'),
    ObjectID = require('mongodb').ObjectID,
    mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || config.mongodb.mongoUrl,
    router = express.Router(),
    TASKS_PER_GAME = 4;


router.post('/task/create', function(req, res) {
    console.log('Adding ' + req.body.taskName + ' with location ' + req.body.location + ' to db');
    MongoClient.connect(mongoUrl, function(err, db) {
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
        }, function(err) {
            if (err) throw err;
            res.send('OK');
        });

    });
});


router.post('/register', function(req, res) {
    console.log('registering new user: ' + req.body.username);
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection(config.mongodb.userTable);
        collection.ensureIndex({
            username: 1
        }, {
            unique: true
        }, function(err) {
            if (err) {
                console.log(err);
            } else {
                collection.insert(req.body, function(err) {
                    if (err) {
                        console.log(err);
                        res.redirect('/register');
                    } else {
                        res.redirect('/login');
                    }

                    db.close();
                });
            }
        });

    });
});


router.post('/game/createHunt', function(req, res) {

    MongoClient.connect(mongoUrl, function(err, db) {

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

router.get('/statistics', function(req, res) {
    
    console.log(req.session.userInfo);
    var stats = getStatsByUsername(req.session.userInfo.username, function(error, user){
        if (user !== null){
            res.json(user.username);
        } else {
            res.json({
                'msg' : 'could not find user'
            });
            console.log('User could not be found');
        }
    });
});

function getStatsByUsername(username, fn) {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection(config.mongodb.userTable);
        collection.findOne({
            'username': username
        }, function(err2, user) {
            if (err) {
                fn(null, null);
                throw err;
            }
            db.close();
            return fn(null, user);
        });
    });
}


router.get('/game/getActiveTask/:gameId', function(req, res) {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var id = req.param('gameId'),
            collection = db.collection(config.mongodb.gameTable);

        collection.findOne({
            '_id': new ObjectID(id)
        }, function(err, game) {
            if (err) throw err;
            //console.log(game.tasks[game.index]._id);
            console.log(game);
            if (game.tasks.indexOf(null) !== -1) {
                console.log('Error finding tasks for game ' + id);
                console.log('at least one task is missing: ' + game);
                res.json({
                    'msg': 'error, no task found'
                });
            } else if (game.index == TASKS_PER_GAME - 1) {
                res.json({
                    'msg': 'Game Over!'
                });
            } else {
                var task = game.tasks[game.index];
                res.json({
                    'msg': 'ok',
                    'task': {
                        id: task._id,
                        taskName: task.taskName,
                        riddleText: task.riddleText,
                        hint1: task.hints[0],
                        hint2: task.hints[1]
                    }
                });
            }

            db.close();
        });
    });
});

//increments the task-counter of the active game
function incrementGame(db, gameId, cb) {
    var collection = db.collection(config.mongodb.gameTable);
    collection.update({
        '_id': new ObjectID(gameId)
    }, {
        $inc: { //increment game-index by 1
            'index': 1
        }
    }, function(err) {
        if (err) throw err;
        console.log('Successfully incremented index of game ' + gameId);
        db.close();
        cb();
    });
}

router.post('/game/taskComplete/:gameId', function(req, res) {
    MongoClient.connect(mongoUrl, function(err, db) {
        var gameId = req.param('gameId');

        if (req.body.isSkipping === 'true') {
            incrementGame(db, gameId, function() {
                res.json({
                    'msg': 'ok'
                });
            });
        } else if (req.body.isSkipping === 'false' && req.body.location !== '' && req.body.taskId !== undefined) {
            findTaskById(req.body.taskId, function(task) {
                var lonPlayer = req.body.location.lon,
                    latPlayer = req.body.location.lat,
                    accuracy = req.body.location.accuracy;

                var lonTask = task.location.coordinates[0],
                    latTask = task.location.coordinates[1];
                var distance = getDistanceFromLatLonInKm(lonPlayer, latPlayer, lonTask, latTask);
                console.log('Location of Task: lon = ' + lonTask + ' lat = ' + latTask);
                console.log('Location of Player: lon = ' + lonPlayer + ' lat = ' + latPlayer + ' Accuracy: ' + accuracy);
                console.log('Distance to task: ' + distance + ' km');
                //accuracy > 6000 to allow computer based debugging...
                if ((accuracy < 200 || accuracy > 6000) && distance < 0.2) {
                    incrementGame(db, gameId, function() {
                        res.json({
                            'msg': 'Correct location'
                        });
                    });
                    console.log('User found location');
                } else {
                    res.json({
                        'msg': 'Incorrect location'
                    });
                    console.log('User wasn\'t close or accuracy not good enough! (' + accuracy + ')');
                }
            });
        }

    });
});


function findTaskById(id, cb) {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection(config.mongodb.taskTable),
            query = {
                _id: new ObjectID(id)
            };
        collection.findOne(query, function(err, task) {
            if (err) throw err;
            db.close();
            cb(task);
        });
    });
}


function getAllTasks(lon, lat, cb) {
    MongoClient.connect(mongoUrl, function(err, db) {
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



function getDistanceFromLatLonInKm(lon1, lat1, lon2, lat2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}


module.exports = router;
