'use strict';

var MysqlConnector = require ('./mysqlConnector');

//creates a tunneled mysql connection
var db = new MysqlConnector();

//fires a test query
var query = "SELECT count(*) AS solution FROM MediaQ_V2.VIDEO_INFO;";
var rows = db.query(query,function(rows, fields) {
        console.log("Current number of uploaded videos is: " + rows[0].solution);
        db.close();
},10);
