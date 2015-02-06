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

    $('#lon').val(lon);
    $('#lat').val(lat);
});

$('#submitButton').click(function(event) {
    var location = [$('#lon').val(), $('#lat').val()],
        taskName = $('#taskName').val(),
        riddleText = $('#riddleText').val(),
        hints = [$('#hint1').val(), $('#hint2').val()];

    $.post('/user/task/create', {
        'taskName': taskName,
        'completeCount': 0,
        'assignCount': 0,
        'location': location,
        'riddleText': riddleText,
        'hints': hints
    }, function(data) {
        if (data.msg === 'OK'){
            showAlert('success', 'Successfully created new task ' + taskName + '<br\\>');
        }else {
            showAlert('warning', 'Error creating task:<br\>' + data.msg.err + '<br\\>');
        }
    }, 'json');
});


//hides all game elements and only shows the message
function showAlert(type, msg) {
    $('.alert.alert-' + type).append(msg).show();
}