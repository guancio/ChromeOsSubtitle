(function($) {
    $.extend(mejs.MepDefaults, {
        playpauseText: mejs.i18n.t('Play/Pause')
    });
    
    // PLAY/pause BUTTON
    MediaElementPlayer.prototype.buildplaypause = function() {
        var t = this,
            playpause = mejs.Utility.createNestedElement('<div class="mejs-button mejs-playpause-button mejs-play" >' +
            '<button type="button" title="' + t.options.playpauseText + '" aria-label="' + t.options.playpauseText + '"></button>' +
        '</div>');
        
        playpause.addEventListener('click', function(e) {
            e.preventDefault();
            t.isPaused() ? t.play() : t.pause();
        });
        t.controls[0].appendChild(playpause);
    }
})(mejs.$);