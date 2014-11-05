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
	mysqlQuery(mysqlTunnel);    
    

});


function mysqlQuery(tunnel){
    
	console.log("Mysql Query starting");

	var connection = mysql.createConnection(config.database);

	connection.connect(function(err) {
	  if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	  }
	  console.log('connected as id ' + connection.threadId);
	  connection.query("SELECT count(*) AS solution FROM MediaQ_V2.VIDEO_INFO ", function(err, rows, fields) {
		  if (err) throw err;
		  console.log(rows);
		  console.log('The solution is: ', rows[0].solution);
	  });
	  
	  connection.end();
	  console.log("close tunnel");
	  tunnel.close();
	});	
	
	
	

}
