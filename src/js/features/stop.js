(function($) {
    $.extend(mejs.MepDefaults, {
        stopText: 'Stop'
    });
    
    // STOP BUTTON
    MediaElementPlayer.prototype.buildstop = function() {
        var t = this,
            stop = mejs.Utility.createNestedElement('<div class="mejs-button mejs-stop-button mejs-stop">' +
                '<button type="button" title="' + t.options.stopText + '" aria-label="' + t.options.stopText + '"></button>' +
                '</div>');
            
            stop.addEventListener('click', function() {
                if(t.getCurrentTime() > 0) {
                    t.stop();
                }
            });
            t.controls[0].appendChild(stop);
    }
})(mejs.$);