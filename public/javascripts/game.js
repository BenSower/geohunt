'use strict';

var gameId, activeTask, pirateCounter = 0;

function setCookie(cname, data) {
    document.cookie = cname + '=' + data + '; ';
}

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
    incrementGame('true');
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

function resetHintButtons() {
    disableButton('#hint1-btn');
    disableButton('#hint2-btn');
    //1.5 sekunden
    setTimeout(enableButton1, 1500);
    //3.0 sekunden
    setTimeout(enableButton2, 3000);
}

$('#skip').click(function() {
    resetHintButtons();
    incrementPirate();
    incrementGame('true');
});

function incrementPirate() {
    $('#pirate' + pirateCounter).hide();
    pirateCounter++;
    $('#pirate' + pirateCounter).show();
}

$('#hint1-btn').click(function() {
    $('#puzzle').append('<br/><br/>Tipp #1:<br/>' + activeTask.hint1);
    disableButton('#hint1-btn');
});


$('#hint2-btn').click(function() {
    $('#puzzle').append('<br/><br/>Tipp #2:<br/>' + activeTask.hint2);
    disableButton('#hint2-btn');
});

$('#done').click(function() {
    incrementGame('false');
});

$('#tryAgain').click(function() {
    $('.gameElements').show();
    $('.alert').hide();
    $('#tryAgain').hide();
});

$('#nextTask').click(function() {
    getNextTask();
    $('.gameElements').show();
    $('.alert').hide();
    $('#nextTask').hide();
    incrementPirate();
});

function incrementGame(isSkipping) {
    var json = {
        isSkipping: isSkipping,
        location: null
    };
    if (isSkipping === 'false') {
        getLocation(function(position) {
            json.location = {
                lon: position.coords.longitude,
                lat: position.coords.latitude,
                accuracy: position.coords.accuracy
            };
            json.taskId = getCookie('activeTaskId');
            postTaskComplete(json);
        });
    } else {
        postTaskComplete(json, getNextTask);
    }
}

function postTaskComplete(json, cb) {
    $.post('/user/game/taskComplete/' + gameId, json, function(data) {
        if (data.msg === 'Correct location') {
            showAlert('success', 'Gute Arbeit! Du hast das Objekt gefunden! Mach jetzt schnell ein Video von dem Objekt um es später hochzuladen!');
            $('#nextTask').show();
        } else if (data.msg === 'Incorrect location') {
            showAlert('warning', 'Leider bist du nicht am richtigen Ort, probiers gleich nochmal!');
            $('#tryAgain').show();
        } else {
            cb();
        }
    });
}


//hides all game elements and only shows the message
function showAlert(type, msg) {
    $('.gameElements').hide();
    $('.alert.alert-' + type).text(msg).show();
}


function getNextTask() {
    $.getJSON('/user/game/getActiveTask/' + gameId, function(data) {
        if (data.msg === 'ok') {
            $('#taskName').text(data.task.taskName);
            $('#puzzle').text(data.task.riddleText);
            activeTask = data.task;
            setCookie('activeTaskId', data.task.id);
        } else if (data.msg === 'Game Over!') {
            $('#dashboard').show();
            showAlert('success', data.info);
        } else {
            console.log('ERROR incrementing: ' + data.msg);
        }
    });
}


function getLocation(cb) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cb);
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}
