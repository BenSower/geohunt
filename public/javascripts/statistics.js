'use strict';

$( document ).ready(function() {
    
    $.getJSON('/user/statistics', function(stats){
    	$('#stats').text('Username: ' + stats);
    });
});