'use strict';

var gameId;

function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return '';
}

$(document).ready(function() {

    function enableButton1() {
        $('#hint1-btn').attr('disabled', false);
    }
    setTimeout(enableButton1, 300000);

    function enableButton2() {
        $('#hint2-btn').attr('disabled', false);
    }

    $('#skip').click(function() {
        incrementGame();
    });


    setTimeout(enableButton2, 600000);
    gameId = getCookie('gameId');
    //initial increment to Start the game
    incrementGame();

});




function incrementGame() {

    $.getJSON('/user/game/taskComplete/' + gameId, function(data) {
        if (data.msg !== 'ok') {
            console.log('ERROR incrementing ');
        } else {
            $.getJSON('/user/game/getActiveTask/' + gameId, function(data) {
                if (data.msg !== 'ok') {
                    console.log('ERROR incrementing getting first task');
                } else {
                    $('#bubble').text(data.task.riddleText);
                }
            });
        }
    });
}
