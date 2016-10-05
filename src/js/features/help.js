(function() {
    MediaElementPlayer.prototype.help = function() {
        var t = this;
        
        t.openHelp = function() {
            chrome.app.window.create('wiki.html', { id: 'wiki', outerBounds: { width: 1040, height: 600 } });
        };
        
        $('<div class="mejs-button mejs-help"><button type="button" title="' + chrome.i18n.getMessage('help') + '" aria-label="' + chrome.i18n.getMessage('help') + '"></button></div>')
            .appendTo(t.rightControls)
            .on('click', function(e) {
                e.preventDefault();
                t.openHelp();
            });
    };
})();
