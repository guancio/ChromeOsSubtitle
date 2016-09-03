(function($) {
    MediaElementPlayer.prototype.subsize = function() {
        var t = this,
            captionSelector = t.captionsButton.find('.mejs-captions-selector');
        
        function updateCaptionSize(value) {
            mejs.Utility.setIntoSettings("default_sub_size", value);
            
            $('.mejs-captions-layer').css({
                "line-height": value + "px",
                "font-size": value + "px"
            });
        }
        
        var value = $('<input style="background-color: transparent; width: 41px; color: white; font-size: 10px;clear: none; margin:0px 0px 0px 0px;"></input>').on('input', function(e) {
                updateCaptionSize(Number(t.capSizeInput.value));
            });
        
        t.capSizeInput = value[0];
        
        t.decCaptionSize = function() {
            t.capSizeInput.value = (Number(t.capSizeInput.value) / 1.2).toFixed(0);
            updateCaptionSize(Number(t.capSizeInput.value));
        }
        t.incCaptionSize = function() {
            t.capSizeInput.value = (Number(t.capSizeInput.value) * 1.2).toFixed(0);
            updateCaptionSize(Number(t.capSizeInput.value));
        }
        
        // create the buttons
        var dec = $('<div class="mejs-button mejs-reduce-button mejs-reduce" >' +
                '<button type="button" title="' + mejs.i18n.t('Decrease caption size') + '" aria-label="' + mejs.i18n.t('Decrease caption size') + '"></button>' + '</div>').click(function() {
                t.decCaptionSize();
            }),
            inc = $('<div class="mejs-button mejs-increase-button mejs-increase" >' +
                '<button type="button" title="' + mejs.i18n.t('Increase caption size') + '" aria-label="' + mejs.i18n.t('Increase caption size') + '"></button>' + '</div>').click(function() {
                t.incCaptionSize();
            }),
            line = $('<li class="mejs-captionsize"></li>')
                .append($('<label style="width:74px;float: left;padding: 0px 0px 0px 5px;">Caption size</label>'))
                .append(dec)
                .append(value)
                .append(inc);
        
        captionSelector.find('ul').append(line);
        
        mejs.Utility.getFromSettings('default_sub_size', 22, function(value) {
            t.capSizeInput.value = value;
            updateCaptionSize(Number(t.capSizeInput.value));
        });
    }
})(mejs.$);