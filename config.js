module.exports = {
        remoteHost: 'mediaq.dbs.ifi.lmu.de', // mediaq server host
        remotePort: 3306, // mediaq-mysql server port
        localPort: 31337, // a available local port
        verbose: true, 	// dump information to stdout
        sshConfig: {             
        	host: 'remote.cip.ifi.lmu.de', 
            port: 22,
            username: 'sauerb',
            password: 'datafr3aklmu', // option see ssh2 config,
        },
        database: {
           host: "127.0.0.1",
           port: 31337,
           user: "student",
           password: "tneduts",
           database: "MediaQ_V2"
       }
};
