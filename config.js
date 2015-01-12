module.exports = {
    remoteHost: 'mediaq.dbs.ifi.lmu.de', // mediaq server host
    remotePort: 3306, // mediaq-mysql server port
    localPort: 31337, // a available local port
    verbose: true, // dump information to stdout
    sshConfig: {
        host: 'remote.cip.ifi.lmu.de',
        port: 22,
        username: 'sauerb',
        password: '', // option see ssh2 config,
    },
    database: {
        host: '127.0.0.1',
        port: 31337,
        user: '',
        password: '',
        database: 'MediaQ_V2'
    },
    mongodb: {
      mongoUrl : 'mongodb://localhost:27017/mediaquery',
      taskTable : 'tasks',
      userTable : 'users',
      groupTable: 'groups'
    },
    sessionSecret: 'U^SCjYmj+WP2r5?X$kTtU@7+TFwJH@'
};
