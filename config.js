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
        user: 'student',
        password: '***REMOVED***',
        database: 'MediaQ_V2'
    },
    sessionSecret: 'flkdfkföldrfkö',
    mongodb: {
        mongoUrl : 'mongodb://localhost:27017/mediaquery',
        userTable : 'users',
        taskTable : 'tasks',
        groupTable : 'groups',
        gameTable : 'games'
    }
};
