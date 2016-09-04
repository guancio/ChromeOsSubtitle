(function() {
    MediaElementPlayer.prototype.help = function() {
        var t = this,
            helpText = '<div class="mejs-window">' +
                            '<h2>Help</h2>' +
                            '<div>' +
                                '<table style="color:#fff; width: 100%">' +
                                    '<tr><td style="width:60px">Spacebar</td><td style="width:100px">Play/Pause</td></tr>' +
                                    '<tr><td>[CTRL] + Up|Down</td><td>Change Volume</td></tr>' +
                                    '<tr><td>[SHIFT|ALT|CTRL] +  Left|Right</td><td>Seek 3s/10s/60s</td></tr>' +
                                    '<tr><td>[CTRL] + f</td><td>Toggle Fullscreen</td></tr>' +
                                    '<tr><td>[CTRL] + o</td><td>Open Files</td></tr>' +
                                    '<tr><td>[CTRL] + d</td><td>Download Subtitles</td></tr>' +
                                    '<tr><td>[CTRL] + +|-</td><td>Change Subtitle Size</td></tr>' +
                                    '<tr><td>[CTRL] + x|z</td><td>Change Subtitle Delay</td></tr>' +
                                    '<tr><td>[CTRL] + ,|.</td><td>Change Playback Speed (Finer)</td></tr>' +
                                    '<tr><td>[CTRL + SHIFT] + ,|.</td><td>Change Playback Speed (Coarser)</td></tr>' +
                                    '<tr><td>[CTRL] + /</td><td>Reset Playback Speed</td></tr>' +
                                    '<tr><td>[CTRL] + l</td><td>Toggle Loop</td></tr>' +
                                    '<tr><td>[CTRL + SHIFT] + Arrows</td><td>Move Captions\' Position</td></tr>' +
                                    '<tr><td>[CTRL] + i</td><td>show info window</td></tr>' +
                                    '<tr><td>[CTRL] + [ | ]</td><td>Previous/Next Media</td></tr>' +
                                    '<tr><td>[CTRL] + a</td><td>Change Aspect Ratio</td></tr>' +
                                    '<tr><td>[ALT] + ,|. </td><td>Change Audio Delay</td></tr>' +
                                '</table>' +
                            '</div><br/>' +
                            '[Click the box to close the help page]' +
                        '</div>',
            helpPanel = $(helpText);
        
        t.controls.parentElement.appendChild(helpPanel);
        helpPanel.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            t.toggleHelp();
        });
        
        t.toggleHelp = function() {
            helpPanel.toggleHide();
        };
        
        var open = $('<div class="mejs-button mejs-help-button mejs-help" >' +
                '<button type="button" title="' + mejs.i18n.t('Help...') + '" aria-label="' + mejs.i18n.t('Help...') + '"></button></div>');
        
        t.rightControls.append(open);
        open.on('click', function(e) {
            e.preventDefault();
            t.toggleHelp();
        });
    }
})();