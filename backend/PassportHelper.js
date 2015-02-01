'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    config = require('../config'),
    mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || config.mongodb.mongoUrl;

function findById(id, fn) {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection(config.mongodb.userTable);
        collection.findOne({
            '_id': new ObjectID(id)
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


// Find the user by username.  If there is no user with the given
// username, or the password is not correct, set the user to `false` to
// indicate failure and set a flash message.  Otherwise, return the
// authenticated `user`.
function findByUsername(username, fn) {
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

function PassportHelper() {}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
PassportHelper.serializeUser = function(user, done) {
    done(null, user._id);
};

PassportHelper.deserializeUser = function(id, done) {
    findById(id, function(err, user) {
        done(err, user);
    });
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
PassportHelper.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.

PassportHelper.authenticate = new LocalStrategy(
    function(username, password, done) {
        findByUsername(username, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('User ' + username + ' does not exist');
                return done(null, false, {
                    message: 'Unknown user ' + username
                });
            }
            if (user.password != password) {
                console.log('Password wrong');
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            console.log('Correct Login. Booya!');
            return done(null, user);
        });
    }
);




module.exports = PassportHelper;
