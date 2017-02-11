(function() {
    var capSizeInput,
        capSizeValue;
    
    function updateCaptionSize() {
        $('.mejs-captions-layer').css({
            'line-height': capSizeValue + 'px',
            'font-size': capSizeValue + 'px'
        });
    }
    
    MediaElementPlayer.prototype.changeSubtitleSize = function(decrease) {
        capSizeValue = Math.min(Math.max(10, capSizeValue + (decrease ? -2 : 2)), 50);
        this.notify('Caption Size: ' + capSizeValue + 'px');
        wrnch.storage.set('default_sub_size', capSizeValue);
        capSizeInput.attr({ value: capSizeValue.toFixed() });
        updateCaptionSize();
    };
    
    MediaElementPlayer.prototype.subsize = function() {
        var t = this,
            captionSelector = t.captionsButton.find('.mejs-captions-selector');
        
        capSizeInput = $('<input type="number" min="10" max="50" step="2"></input>').on('input', function(e) {
            capSizeValue = parseInt(e.target.value) || 0;
            wrnch.storage.set('default_sub_size', capSizeValue);
            updateCaptionSize();
        });
        
        $('<li class="mejs-captionsize"></li>')
            .append($('<label>Caption size</label>'))
            .append(capSizeInput)
            .appendTo(captionSelector.find('ul'));
        
        wrnch.storage.get('default_sub_size', 22, function(value) {
            capSizeInput.attr({ value: Number(value).toFixed() });
            capSizeValue = value;
            updateCaptionSize();
        });
    };
})();
