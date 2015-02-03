module.exports = {
    database: {
        host: 'mediaq.dbs.ifi.lmu.de',
        port: 3306,
        user: 'student',
        password: 'xxxxxx',
        database: 'MediaQ_V2'
    },
    sessionSecret: 'flkdfkföldrfkö',
    mongodb: {
        mongoUrl : 'mongodb://localhost/mediaquery',
        userTable : 'users',
        taskTable : 'tasks',
        groupTable : 'groups',
        gameTable : 'games'
    }
};
