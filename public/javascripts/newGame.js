'use strict';
$('#gameButton').click(function(event) {

	var href = '/mobile/game';

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    function showPosition(position) {
    	var lon = position.coords.longitude,
    		lat = position.coords.latitude;

    	//send userId lon and lat to server
        $.post('/user/game/createHunt', {
            'lon': lon,
            'lat': lat,
            'user': 'dummy'
        }, function(data) {
            setCookie ('gameId', data);
        	window.location = href;
        }, 'json');
    }
    
    function setCookie(cname,  data) {
    	document.cookie = cname + '=' + data + '; ';
	}


    //getLocation, send it to server and create new game
    getLocation();
});
