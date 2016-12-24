var mainMediaElement;

$(window).on('load', function() {
    $('<video id="player"></video>').appendTo($(document.body));
    
    mainMediaElement = MediaElementPlayer(document.getElementById('player'));
});
