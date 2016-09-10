(function() {
    MediaElementPlayer.prototype.subdelay = function() {
        var t = this,
            captionSelector = t.captionsButton.find('.mejs-captions-selector');
        
        t.capDelayInput = $('<input type="number" step="0.1"></input>').on('input', function(e) {
                t.capDelayValue = parseFloat(e.target.value) || 0;
                t.notify('Captions Delay: ' + (t.capDelayValue * 1000).toFixed() + 'ms');
            });
        
        
        t.capDelayInput.attr({ 'value': 0 });
        t.capDelayValue = 0;
        
        t.decCaptionDelay = function() {
            t.capDelayValue -= 0.1;
            t.capDelayInput.attr({ 'value': t.capDelayValue.toFixed(1) });
            t.notify('Captions Delay: ' + (t.capDelayValue * 1000).toFixed() + 'ms');
        };
        t.incCaptionDelay = function() {
            t.capDelayValue += 0.1;
            t.capDelayInput.attr({ 'value': t.capDelayValue.toFixed(1) });
            t.notify('Captions Delay: ' + (t.capDelayValue * 1000).toFixed() + 'ms');
        };
        
        line = $('<li class="mejs-captionsize"></li>')
                .append($('<label>Caption delay</label>'))
                .append(t.capDelayInput);
        
        captionSelector.find('ul').append(line);
        
        t.media.addEventListener('loadeddata', function() {
            t.capDelayInput.attr({ 'value': 0 });
            t.capDelayValue = 0;
        });
    }
})();