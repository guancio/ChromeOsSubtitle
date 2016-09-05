(function() {
    MediaElementPlayer.prototype.help = function() {
        var t = this;
        
        t.toggleHelp = function() {
            chrome.app.window.create('wiki.html', { id: 'wiki', outerBounds: { width: 1040, height: 600 } });
        };
        
        $('<div class="mejs-button mejs-help-button mejs-help"><button type="button" title="' + mejs.i18n.t('Help...') + '" aria-label="' + mejs.i18n.t('Help...') + '"></button></div>')
            .appendTo(t.rightControls)
            .on('click', function(e) {
                e.preventDefault();
                t.toggleHelp();
            });
    }
})();