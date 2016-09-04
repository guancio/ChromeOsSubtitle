(function() {
    MediaElementPlayer.prototype.subsize = function() {
        var t = this,
            captionSelector = t.captionsButton.find('.mejs-captions-selector');
        
        function updateCaptionSize() {
            $('.mejs-captions-layer').css({
                "line-height": t.capSizeValue + "px",
                "font-size": t.capSizeValue + "px"
            });
        }
        
        t.capSizeInput = $('<input style="background-color: transparent; width: 41px; color: white; font-size: 10px;clear: none; margin:0px 0px 0px 0px;"></input>').on('input', function(e) {
                t.capSizeValue = t.capSizeInput.attr('value');
                mejs.Utility.setIntoSettings("default_sub_size", t.capSizeValue);
                updateCaptionSize();
            });
        
        t.decCaptionSize = function() {
            t.capSizeValue /= 1.2;
            mejs.Utility.setIntoSettings("default_sub_size", t.capSizeValue);
            t.capSizeInput.attr({ 'value': t.capSizeValue.toFixed() });
            updateCaptionSize();
        };
        t.incCaptionSize = function() {
            t.capSizeValue *= 1.2;
            mejs.Utility.setIntoSettings("default_sub_size", t.capSizeValue);
            t.capSizeInput.attr({ 'value': t.capSizeValue.toFixed() });
            updateCaptionSize();
        };
        
        // create the buttons
        var dec = $('<div class="mejs-button mejs-reduce-button mejs-reduce" >' +
                '<button type="button" title="' + mejs.i18n.t('Decrease caption size') + '" aria-label="' + mejs.i18n.t('Decrease caption size') + '"></button>' + '</div>').on('click', function() {
                t.decCaptionSize();
            }),
            inc = $('<div class="mejs-button mejs-increase-button mejs-increase" >' +
                '<button type="button" title="' + mejs.i18n.t('Increase caption size') + '" aria-label="' + mejs.i18n.t('Increase caption size') + '"></button>' + '</div>').on('click', function() {
                t.incCaptionSize();
            }),
            line = $('<li class="mejs-captionsize"></li>')
                .append($('<label style="width:74px;float: left;padding: 0px 0px 0px 5px;">Caption size</label>'))
                .append(dec)
                .append(t.capSizeInput)
                .append(inc);
        
        captionSelector.find('ul').append(line);
        
        mejs.Utility.getFromSettings('default_sub_size', 22, function(value) {
            t.capSizeInput.attr({ 'value': value.toFixed() });
            t.capSizeValue = value;
            updateCaptionSize();
        });
    }
})();