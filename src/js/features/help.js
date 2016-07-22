(function($) {
    MediaElementPlayer.prototype.buildhelp = function(player, controls, layers, media) {
        var
            t = this;
            
        var helpPanel = $(
            '<div class="me-window" style="color:#fff;margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;width:500px;display: table; height: auto;background: url(background.png);background: rgba(50,50,50,0.7);border: solid 1px transparent;padding: 10px;overflow: hidden;-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0;font-size: 16px;visibility: hidden;">' +
            '<h2>Help</h2>' +
            '<div>' +
            '<table style="color:#fff">' +
            '<tr><td style="width:60px">space</td><td style="width:100px">play/pause</td></tr>' +
            '<tr><td>[ctrl]up</td><td>volume up</td>' +
            '<td style="width:60px">[ctrl]down</td><td style="width:100px">volume down</td></tr>' +
            '<tr><td>[shift|alt|ctrl]left</td><td>rewind</td>' +
            '<td>[shift|alt|ctrl]right</td><td>forward</td></tr>' +
            '<tr><td>[ctrl]f</td><td>fullscreen</td></tr>' +
            '<tr><td>[ctrl]o</td><td>open video</td></tr>' +
            '<tr><td>[ctrl]d</td><td>download subtitle</td></tr>' +
            '<tr><td>[ctrl]-</td><td>decrease subtitle size</td>' +
            '<td>[ctrl]+</td><td>increase subtitle size</td></tr>' +
            '<tr><td>[ctrl],</td><td>increase playback speed</td>' +
            '<td>[ctrl].</td><td>decrease subtitle delay</td></tr>' +
            '<tr><td>[ctrl]/</td><td>reset playback speed</td>' +
            '<td>[ctrl]l</td><td>toggle loop</td></tr>' +
            '</table>' +
            '</div><br/>' +
            '[Click outside the box to close the help page]</div>'
        ).appendTo(controls[0].parentElement);
        
        function hide(e) {
            helpPanel.css('visibility', 'hidden');
            if(player.media.paused)
                $(".mejs-overlay-play").show();
                
            e.preventDefault();
            e.stopPropagation();
            player.container.off("click", hide);
            
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
            $(".mejs-overlay-play").hide();
            player.container.click(hide);
        };
        var open =
            $('<div class="mejs-button mejs-help-button mejs-help" >' +
                '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Help...') + '" aria-label="' + mejs.i18n.t('Help...') + '"></button>' +
                '</div>')
            .appendTo(controls)
            .click(function(e) {
                e.preventDefault();
                t.openHelpWindow();
                return false;
            });
    }
})(mejs.$);
