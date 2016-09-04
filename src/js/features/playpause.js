(function($) {
    var playpauseText = mejs.i18n.t('Play/Pause');
    
    // PLAY/pause BUTTON
    MediaElementPlayer.prototype.playpause = function() {
        var t = this,
            playpause = $('<div class="mejs-button mejs-playpause-button mejs-play" >' +
                '<button type="button" title="' + playpauseText + '" aria-label="' + playpauseText + '"></button>' +
            '</div>');
        
        playpause.on('click', function(e) {
            e.preventDefault();
            t.isPaused() ? t.play() : t.pause();
        });
        t.leftControls.append(playpause);
    }
})(mejs.$);