(function($) {
    $.extend(mejs.MepDefaults, {
        stopText: 'Stop'
    });
    
    // STOP BUTTON
    MediaElementPlayer.prototype.buildstop = function(player, controls, layers, media) {
        var t = this,
            stop = $('<div class="mejs-button mejs-stop-button mejs-stop">' +
                '<button type="button" aria-controls="' + t.id + '" title="' + t.options.stopText + '" aria-label="' + t.options.stopText + '"></button>' +
                '</div>')
            .appendTo(controls)
            .click(function() {
                if(media.currentTime > 0) {
                    player.stop();
                    layers.find('.mejs-poster').show();
                }
            });
    }
})(mejs.$);