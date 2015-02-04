'use strict';
/*
* STANDALONE script to add some simple tasks to the db
*/

var MongoClient = require('mongodb').MongoClient,
    config = require('../config'),
    mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || config.mongodb.mongoUrl;

var examples = [{
        taskName: 'Bayerns berühmteste Tänzer',
        userId: 0,
        completeCount: 0,
        assignCount: 0,
        riddleText: 'Sie waren die ersten, die nach der Pest wieder auf die Straßen gingen und brachten ein Lächeln auf die Gesichter der Menschen. Nach ihrem Handwerk ist das beliebteste Kartenspiel Bayerns bekannt. Filme sie bei einem ihrer zwei täglichen Tänze.',
        hints: ['Es ist am einen der berühmtesten Plätze München.', 'Der Bürgermeister arbeitet in diesem Gebäude.'],
        location: {
            type: 'Point',
            coordinates: [11.575483347221383, 48.1374982787371],
            category: 'task'
        }
    }, {
        taskName: 'Licht im Dunkel',
        userId: 0,
        completeCount: 0,
        assignCount: 0,
        riddleText: 'Der Teufel sieht keine Fenster und doch ist es immer Hell. Sie ist auf jedem Foto von München zu sehen.',
        hints: ['Er hat sich mit seinem Fußabruck dort verewigt.', 'Hier zieht es immer ziemlich.'],
        location: {
            type: 'Point',
            coordinates: [11.572988229848624, 48.13858842296864],
            category: 'task'
        }
    }, {
        taskName: 'Unverheilte Wunden',
        userId: 0,
        completeCount: 0,
        assignCount: 0,
        riddleText: 'Wunden heilen schnell - doch manche behält man besser, um sich an den Krieg zu erinnern. Münchens Studenten laufen täglich an ihnen vorbei.',
        hints: ['Eine große Kirche steht auf der anderen Straßenseite.', 'Schau doch mal an der Ludwig-Maximilians-Universität vorbei!'],
        location: {
            type: 'Point',
            coordinates: [11.580256583430488, 48.149137336061756],
            category: 'task'
        }
    }, {
        taskName: 'Sich die Kugel geben',
        userId: 0,
        completeCount: 0,
        assignCount: 0,
        riddleText: 'Eine echte Kanonenkugel am Kirchenfenster ist ein gutes Mahnmal für die Toten der Koalitionskriege.',
        hints: [' Man kann den Turm mit über 300 Stufen besteigen und hat einen tollen Ausblick über München', 'Die Kirche steht in der Nähe vom Viktualienmarkt.'],
        location: {
            type: 'Point',
            coordinates: [11.576109073216273, 48.13640876146482],
            category: 'task'
        }
    }, {
        taskName: 'Mädchenzimmer',
        userId: 0,
        completeCount: 0,
        assignCount: 0,
        riddleText: 'Zu Arielle, Cinderella und Rapunzel hätte dieser ehemalige Turm der Stadtmauer gut gepasst.',
        hints: ['Er wird auch Lugerturm genannt', 'Er steht in der Nähe vom Isartor.'],
        location: {
            type: 'Point',
            coordinates: [11.575483347221383, 48.1374982787371],
            category: 'task'
        }
    }, {
        taskName: 'Fremd ist der Fremde nur in der Fremde',
        userId: 0,
        completeCount: 0,
        assignCount: 0,
        riddleText: 'Der typische Münchner wacht über den Markt mit dem selben Anfangsbuchstaben wie sein Nachname. Seine Statue spritzt immer Wasser.',
        hints: ['Man kann hier über das ganze Jahr Lebensmittel kaufen.', 'In der Mitte steht ein Maibaum.'],
        location: {
            type: 'Point',
            coordinates: [11.576381046761636, 48.1352249438624],
            category: 'task'
        }
    }

];



MongoClient.connect(mongoUrl, function(err, db) {
    if (err) throw err;
    //console.log(req.body);
    var collection = db.collection(config.mongodb.taskTable);
    collection.ensureIndex({
        'location': '2dsphere'
    }, function(err) {
        if (err) throw err;
    });

    collection.insert(examples, function(err, insertedDocs) {
        if (err) throw err;
        console.log('saved ' + insertedDocs.length + ' example riddles');
        db.close();
        process.exit();
    });

});
