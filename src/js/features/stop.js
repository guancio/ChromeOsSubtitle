(function() {
    // STOP BUTTON
    MediaElementPlayer.prototype.stopButton = function() {
        var t = this;
        
        $('<div class="mejs-button mejs-stop-button mejs-stop">' +
            '<button type="button" title="Stop" aria-label="Stop"></button>' +
        '</div>')
        .on('click', function() {
            if(t.getCurrentTime() > 0) {
                t.stop();
            }
        })
        .appendTo(t.leftControls);
    };
})();
