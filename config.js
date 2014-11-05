module.exports = {
        remoteHost: '<mediaq server>', // e.g. mediaq.dbs.ifi.lmu.de
        remotePort: 3306, // mediaq-mysql server port
        localPort: 31337, // a available local port
        verbose: true, 	// dump information to stdout
        sshConfig: {             
        	host: '<tunnel host>', //e.g. remote.cip.ifi.lmu.de
            port: 22,
            username: '<cip username>',
            password: '<cip pw>', // option see ssh2 config,
        },
        database: {
           host: "127.0.0.1",
           port: 31337,
           user: "<mediaq db-user>", //e.g. student
           password: "<mediaq db-pw>",
           database: "<mediaq DB>" //e.g. MediaQ_V2
       }
}; 
