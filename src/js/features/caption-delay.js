(function($) {
    MediaElementPlayer.prototype.buildsubdelay = function() {
        var t = this,
            captionSelector = t.captionsButton.find('.mejs-captions-selector');
        
        var value =
            $('<input style="background-color: transparent; width: 41px; color: white; font-size: 10px;clear: none; margin:0px 0px 0px 0px;"></input>').
        on('input', function(e) {
            t.capDelayValue = Number(t.capDelayInput.value);
        });
        
        t.capDelayInput = value[0];
        t.capDelayInput.value = 0;
        
        t.decCaptionDelay = function() {
            t.capDelayInput.value = (Number(t.capDelayInput.value) - 0.1).toFixed(1);
            t.capDelayValue = Number(t.capDelayInput.value);
            t.setNotification('Captions Delay: ' + t.capDelayValue + 's');
        };
        t.incCaptionDelay = function() {
            t.capDelayInput.value = (Number(t.capDelayInput.value) + 0.1).toFixed(1);
            t.capDelayValue = Number(t.capDelayInput.value);
            t.setNotification('Captions Delay: ' + t.capDelayValue + 's');
        };
        
        // create the buttons
        var dec =
            $('<div class="mejs-button mejs-reduce-button mejs-reduce" >' +
                '<button type="button" title="' + mejs.i18n.t('Decrease caption delay') + '" aria-label="' + mejs.i18n.t('Decrease caption delay') + '"></button>' + '</div>')
            .click(function() {
                t.decCaptionDelay();
            });
        var inc =
            $('<div class="mejs-button mejs-increase-button mejs-increase" >' +
                '<button type="button" title="' + mejs.i18n.t('Increase caption delay') + '" aria-label="' + mejs.i18n.t('Increase caption delay') + '"></button>' + '</div>')
            .click(function() {
                t.incCaptionDelay();
            });
            
        var line =
            $('<li class="mejs-captionsize"></li>')
            .append($('<label style="width:74px;float: left;padding: 0px 0px 0px 5px;">Caption delay</label>'))
            .append(dec)
            .append(value)
            .append(inc);
        captionSelector.find('ul').append(line);
        
        t.media.addEventListener('loadeddata', function() {
            t.capDelayInput.value = 0;
            t.capDelayValue = 0;
        });
    }
})(mejs.$);