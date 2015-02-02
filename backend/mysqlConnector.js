'use strict';
var mysql  = require('mysql'),
	config = require('../config');

/*
Constructor, returns a ssh tunneled mysql-connection object
*/
function MysqlConnector(){
    var self = this;
	self.connectMysql(function(){ return self; });
}

/*
* connects to the mysql db
*/
MysqlConnector.prototype.connectMysql = function (callback){
    var self = this;
	//initializes connection, but does not actually connect it
	self.connection = mysql.createConnection(config.database);

	console.log('Trying to connect to Mysql DB...');
	//actually establishes a connection to the mysql-db
	self.connection.connect(function(err) {
		if (err) {
		  console.error('error connecting: ' + err.stack);
		  return;
		}
		console.log('Connected to Mysql DB on ' + config.database.host);
		callback();
	});
};

/*
* returns @rows selected by @query
*/
MysqlConnector.prototype.query = function (query, callback, maxRetries, retry){
    var self = this;
    retry = (retry === undefined) ? 1 : retry;
    maxRetries = (maxRetries === undefined) ? 10 : maxRetries;

    if (self.connection === undefined && retry <= maxRetries){
    	console.log('Connection not yet established, waiting and trying again. Attempt :' + retry + '/' +maxRetries);
    	setTimeout(function() {
            self.query(query, callback, maxRetries, retry +1);
        }, 3000);
        return;
    }
    else if (self.connection === undefined && retry >= maxRetries) {
    	console.log('Connection could not be established, quitting');
	   	return;
    }
	self.connection.query(query, function(err, rows, fields) {
		  if (err) throw err;
		  callback(rows, fields);
	});
};

/*
* closes the connection
*/
MysqlConnector.prototype.close = function () {
	var self = this;
	if (self.connection === undefined){
		console.log('connection not yet established, cannot close it');
		return;
	}
	self.connection.end();
	console.log('closing mysql connection');
};


module.exports = MysqlConnector;
