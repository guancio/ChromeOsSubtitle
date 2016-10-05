(function() {
    MediaElementPlayer.prototype.info = function() {
        var t = this,
            infoText = '<div class="mejs-window" style="width:650px;">' +
                            '<img src="icon.png" style="width:80px;height:auto;"/>' +
                            '<h2>Subtitle Videoplayer v' + chrome.runtime.getManifest().version + '</h2>' +
                            'Please visit our project <a href="https://github.com/guancio/ChromeOsSubtitle">home page</a>.' +
                            'This software is possible thanks to several open source projects:' +
                            '<ul>' +
                                '<li>The main media player component is a fork of <a id="link_mediaelement" href="http://mediaelementjs.com/">MediaElement.js</a>, developed by John Dyer</li>' +
                                '<li>Zip files are opened using <a href="http://gildas-lormeau.github.io/zip.js/" target="_blank">zip.js</a></li>' +
                                '<li>Subtitles service is powered by <a href="http://www.OpenSubtitles.org" target="_blank">www.OpenSubtitles.org</a>. More uploaded subs means more subs available. Please upload <a href="http://www.opensubtitles.org/upload" target="_blank">here</a> your subs.<br/><a href="http://www.OpenSubtitles.org" target="_blank"><img src="opensubtitle.gif"/></a></li>' +
                            '</ul><br>' +
                        '</div>',
            info = $(infoText)
                        .appendTo(t.container)
                        .on('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            t.toggleInfo();
                        });
        
        // Apply onClick to all a tags #issue
        info
            .find('a')
            .on('click', function(e) {
                window.open(this.href, '_blank');
                e.stopPropagation();
            });
        
        t.toggleInfo = function() {
            info.css('visibility') === 'visible' ? info.hide() : info.show();
        };
        
        $('<div class="mejs-button mejs-info"><button type="button" title="' + chrome.i18n.getMessage('info') + '" aria-label="' + chrome.i18n.getMessage('info') + '"></button></div>')
            .appendTo(t.rightControls)
            .on('click', function(e) {
                e.preventDefault();
                t.toggleInfo();
            });
    };
})();
