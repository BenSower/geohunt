'use strict';

var gameId, activeTask, pirateCounter = 0;

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

    resetHintButtons();
    gameId = getCookie('gameId');
    //initial increment to Start the game
    incrementGame();

});

function enableButton1() {
    $('#hint1-btn').attr('disabled', false);
}

function enableButton2() {
    $('#hint2-btn').attr('disabled', false);
}

function disableButton(button) {
    $(button).attr('disabled', true);
}

function resetHintButtons(){
    disableButton('#hint1-btn');
    disableButton('#hint2-btn');
    //1.5 sekunden
    setTimeout(enableButton1, 1500);
    //3.0 sekunden
    setTimeout(enableButton2, 3000);
}

$('#skip').click(function() {
    resetHintButtons();
    $('#pirate' + pirateCounter).hide();
    pirateCounter++;
    $('#pirate' + pirateCounter).show();
    incrementGame();
});


$('#hint1-btn').click(function() {
    $('#puzzle').append('<br/><br/>Tipp #1:<br/>' + activeTask.hint1);
});


$('#hint2-btn').click(function() {
    $('#puzzle').append('<br/><br/>Tipp #2:<br/>' + activeTask.hint2);
});

$('#done').click(function() {
    $.getJSON('/user/game/taskComplete/' + gameId, function(data) {

    });
});

function incrementGame() {

    $.getJSON('/user/game/taskComplete/' + gameId, function(data) {
        if (data.msg !== 'ok') {
            console.log('ERROR incrementing ');
        } else {
            $.getJSON('/user/game/getActiveTask/' + gameId, function(data) {
                if (data.msg === 'ok') {
                    $('#taskName').text(data.task.taskName);
                    $('#puzzle').text(data.task.riddleText);
                    activeTask = data.task;
                } else if (data.msg === 'Game Over!') {
                    $('#puzzle').text(data.msg);
                    $('#skip').attr('disabled', true);
                } else {
                    console.log('ERROR incrementing getting first task');
                }
            });
        }
    });
}
