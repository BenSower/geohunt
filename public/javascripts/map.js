'use strict';
var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
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

var projectionSelect = new ol.dom.Input(document.getElementById('projection'));
projectionSelect.bindTo('value', mousePositionControl, 'projection')
    .transform(
        function(code) {
            // projectionSelect.value -> mousePositionControl.projection
            return ol.proj.get( /** @type {string} */ (code));
        },
        function(projection) {
            // mousePositionControl.projection -> projectionSelect.value
            return projection.getCode();
        });

var precisionInput = document.getElementById('precision');
precisionInput.addEventListener('change', function() {
    var format = ol.coordinate.createStringXY(precisionInput.valueAsNumber);
    mousePositionControl.setCoordinateFormat(format);
}, false);
