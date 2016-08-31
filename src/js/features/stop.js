(function() {
    // STOP BUTTON
    MediaElementPlayer.prototype.stop = function() {
        var t = this,
            stop = mejs.Utility.createNestedElement('<div class="mejs-button mejs-stop-button mejs-stop">' +
                    '<button type="button" title="Stop" aria-label="Stop"></button>' +
                '</div>');
            
            stop.addEventListener('click', function() {
                if(t.getCurrentTime() > 0) {
                    t.stop();
                }
            });
            t.leftControls[0].appendChild(stop);
    }
})();