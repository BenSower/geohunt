var MysqlTunnel = require ('./mysqlTunnelModule');

//creates a tunneled mysql connection
var tunnel = new MysqlTunnel();

//fires a test query

var query = "SELECT count(*) AS solution FROM MediaQ_V2.VIDEO_INFO;";
var rows = tunnel.query(query,function(rows) {
        console.log("Current number of uploaded videos is: " + rows[0].solution);
},10);

