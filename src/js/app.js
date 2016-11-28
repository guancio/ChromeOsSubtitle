var mainMediaElement;

$(window).on('load', function() {
    $('<video id="player"></video>').appendTo($(document.body));
    
    MediaElementPlayer(document.getElementById('player'));
});
