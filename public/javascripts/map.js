'use strict';
var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(16),
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
});

var map = new ol.Map({
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }).extend([mousePositionControl]),
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.MapQuest({
                layer: 'osm'
            })
        })
    ],
    view: new ol.View({
        center: ol.proj.transform([11.575596, 48.137441], 'EPSG:4326', 'EPSG:3857'),
        zoom: 18
    })
});

map.on('singleclick', function(evt) {
    var coord = evt.coordinate;
    var transformed_coordinate = ol.proj.transform(coord, 'EPSG:900913', 'EPSG:4326');

    var lon = transformed_coordinate[0],
        lat = transformed_coordinate[1];

    document.getElementById('lon').value = lon;
    document.getElementById('lat').value = lat;
});

document.getElementById('submitButton').addEventListener('click', function(event) {
    var location = [$('#lon').val(), $('#lat').val()],
        riddleText = $('#riddleText').val(),
        hints = [$('#hint1').val(), $('#hint2').val()];

    console.log(location);

    $.post('/api/task/create', {
        'taskName': '<dummy>',
        'userId': '<dummy>',
        'completeCount': 0,
        'assignCount': 0,
        'location': location,
        'riddleText': riddleText,
        'hints': hints
    }, function(data) {
        console.log(data);
    }, 'json');
});
