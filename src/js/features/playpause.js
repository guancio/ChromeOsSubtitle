(function($) {
    $.extend(mejs.MepDefaults, {
        playpauseText: mejs.i18n.t('Play/Pause')
    });
    
    // PLAY/pause BUTTON
    MediaElementPlayer.prototype.buildplaypause = function(player, controls, layers, media) {
        var t = this,
            play = $('<div class="mejs-button mejs-playpause-button mejs-play" >' +
                '<button type="button" aria-controls="' + t.id + '" title="' + t.options.playpauseText + '" aria-label="' + t.options.playpauseText + '"></button>' +
                '</div>')
            .appendTo(controls)
            .click(function(e) {
                e.preventDefault();
                
                if(media.paused) {
                    player.play();
                } else {
                    player.pause();
                }
                
                return false;
            });
    }
})(mejs.$);