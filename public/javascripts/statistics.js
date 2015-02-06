'use strict';

$(document).ready(function() {
    getStats();
});

$('#mediaQCheck').click(function() {
    getStats();
});

function getStats() {
    $.getJSON('/user/statistics', function(stats) {
        console.log(stats);
        var uniqueTasks = [];
        $.each(stats.videoValidation, function(i, task) {
            if ($.inArray(task.taskId, uniqueTasks) === -1) uniqueTasks.push(task.taskId);
        });

        var geoHunt = stats.geoHunt,
            mediaQ = stats.mediaQ,
            tasks = stats.tasks;

        $('#username').text(geoHunt.userName);
        $('#uploadedVideos').text(mediaQ['Uploaded Videos']);
        $('#lastActivity').text(new Date(mediaQ.LastActivityDate).toLocaleDateString());
        $('#tasksCompleted').text(geoHunt.tasksCompleted);
        $('#validatedVideos').text(stats.videoValidation.length);
        $('#validatedTasks').text(uniqueTasks.length);
        $('#globalTaskCount').text(tasks.count);
    });
}
