'use strict';
var MongoClient = require('mongodb').MongoClient,
    config = require('../config'),
    format = require('util').format,
    express = require('express'),
    router = express.Router();


router.post('/create', function(req, res) {
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

router.get('/read', function(req, res) {
    MongoClient.connect(config.mongodb.mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection(config.mongodb.taskTable);
        collection.find({}).toArray(function(err2, items) {
            if (err) throw err;
            res.json(items);
            db.close();
        });
    });
});


module.exports = router;
