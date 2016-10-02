(function() {
    // STOP BUTTON
    MediaElementPlayer.prototype.stopButton = function() {
        var t = this,
            stopText = chrome.i18n.getMessage('stop');
        
        $('<div class="mejs-button mejs-stop-button mejs-stop">' +
            '<button type="button" title="' + stopText + '" aria-label="' + stopText + '"></button>' +
        '</div>')
        .on('click', function() {
            if(t.getCurrentTime() > 0) {
                t.stop();
            }
        })
        .appendTo(t.leftControls);
    };
})();
