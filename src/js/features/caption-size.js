(function() {
    MediaElementPlayer.prototype.subsize = function() {
        var t = this,
            captionSelector = t.captionsButton.find('.mejs-captions-selector');
        
        function updateCaptionSize() {
            $('.mejs-captions-layer').css({
                'line-height': t.capSizeValue + 'px',
                'font-size': t.capSizeValue + 'px'
            });
        }
        
        t.capSizeInput = $('<input type="number" min="10" max="50" step="2"></input>').on('input', function(e) {
                t.capSizeValue = t.capSizeInput.attr('value');
                mejs.Utility.storage.set('default_sub_size', t.capSizeValue);
                updateCaptionSize();
            });
        
        t.decCaptionSize = function() {
            t.capSizeValue = Math.min(t.capSizeValue - 2, 50);
            mejs.Utility.storage.set('default_sub_size', t.capSizeValue);
            t.capSizeInput.attr({ 'value': t.capSizeValue.toFixed() });
            updateCaptionSize();
        };
        t.incCaptionSize = function() {
            t.capSizeValue = Math.max(t.capSizeValue + 2, 10);
            mejs.Utility.storage.set('default_sub_size', t.capSizeValue);
            t.capSizeInput.attr({ 'value': t.capSizeValue.toFixed() });
            updateCaptionSize();
        };
        
        $('<li class="mejs-captionsize"></li>')
                .append($('<label>Caption size</label>'))
                .append(t.capSizeInput)
                .appendTo(captionSelector.find('ul'));
        
        mejs.Utility.storage.get('default_sub_size', 22, function(value) {
            t.capSizeInput.attr({ 'value': Number(value).toFixed() });
            t.capSizeValue = value;
            updateCaptionSize();
        });
    }
})();