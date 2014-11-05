var Tunnel = require('tunnel-ssh');
var mysql  = require('mysql');
var config = require('../config');

    
console.log("starting tunnel");

var mysqlTunnel = new Tunnel(config);

mysqlTunnel.connect(function (err) {
    
	if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	}
	console.log("tunnel connected");
    //call query function
	mysqlConnect(mysqlTunnel);    
});


function mysqlConnect(tunnel){
    
	console.log("Mysql Query starting");

	var connection = mysql.createConnection(config.database);

	connection.connect(function(err) {
		if (err) {
		  console.error('error connecting: ' + err.stack);
		  return;
		}
		
		console.log('connected to DB ' + config.remoteHost);
		
		var query = "SELECT count(*) AS solution FROM MediaQ_V2.VIDEO_INFO;";
		var rows = mysqlQuery(connection, 
								query, 
								function(rows) {
									console.log("Number of uploaded videos is: " + rows[0].solution);
								});
		
		connection.end();
		console.log("closing tunnel");
		tunnel.close();
	});	
}

function mysqlQuery(connection, query, callback){
	connection.query(query, function(err, rows, fields) {
		  if (err) throw err;
	  	  callback(rows);
		  return rows;
	});
}