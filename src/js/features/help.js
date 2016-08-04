(function($) {
    MediaElementPlayer.prototype.buildhelp = function() {
        var t = this;
            
        var helpPanel = $(
            '<div class="me-window" style="color:#fff;margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;width:600px;display: table; height: auto;background: url(background.png);background: rgba(50,50,50,0.7);border: solid 1px transparent;padding: 10px;overflow: hidden;-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0;font-size: 16px;visibility: hidden;">' +
            '<h2>Help</h2>' +
            '<div>' +
            '<table style="color:#fff">' +
            '<tr><td style="width:60px">space</td><td style="width:100px">play/pause</td></tr>' +
            '<tr><td>[ctrl] up|down</td><td>increase/decrease volume</td></tr>' +
            '<tr><td>[shift|alt|ctrl] left|right</td><td>rewind/forward 3s/10s/60s</td></tr>' +
            '<tr><td>[ctrl] f</td><td>fullscreen</td></tr>' +
            '<tr><td>[ctrl] o</td><td>open video</td></tr>' +
            '<tr><td>[ctrl] d</td><td>download subtitle</td></tr>' +
            '<tr><td>[ctrl] +|-</td><td>increase/decrease subtitle size</td></tr>' +
            '<tr><td>[ctrl] x|z</td><td>increase/decrease subtitle delay</td></tr>' +
            '<tr><td>[ctrl] ,|.</td><td>increase/decrease playback speed</td></tr>' +
            '<tr><td>[ctrl] /</td><td>reset playback speed</td></tr>' +
            '<tr><td>[ctrl] l</td><td>toggle loop</td></tr>' +
            '<tr><td>[ctrl+shift] arrows</td><td>move captions</td></tr>' +
            '<tr><td>[ctrl] i</td><td>show info window</td></tr>' +
            '<tr><td>[ctrl] [|]</td><td>previous/next media</td></tr>' +
            '<tr><td>[ctrl] a</td><td>Change aspect ratio</td></tr>' +
            '</table>' +
            '</div><br/>' +
            '[Click outside the box to close the help page]</div>'
        ).appendTo(t.controls[0].parentElement);
        
        function hide(e) {
            helpPanel.css('visibility', 'hidden');
            
            e.preventDefault();
            e.stopPropagation();
            t.container.off("click", hide);
            
            $(document).trigger("helpClosed");
            
            return false;
        }
        
        helpPanel.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            hide(e);
            return false;
        });
        
        t.openHelpWindow = function() {
            $('.me-window').css('visibility', 'hidden');
            helpPanel.css('visibility', 'visible');
            
            t.container.click(hide);
        };
        
        var open =
            $('<div class="mejs-button mejs-help-button mejs-help" >' +
                '<button type="button" title="' + mejs.i18n.t('Help...') + '" aria-label="' + mejs.i18n.t('Help...') + '"></button>' +
                '</div>')
            .appendTo(t.controls)
            .click(function(e) {
                e.preventDefault();
                t.openHelpWindow();
                return false;
            });
    }
})(mejs.$);
