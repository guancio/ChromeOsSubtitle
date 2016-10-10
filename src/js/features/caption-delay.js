(function() {
    var capDelayInput;
    
    MediaElementPlayer.prototype.decCaptionDelay = function() {
        t.capDelayValue -= 0.1;
        capDelayInput.attr({ 'value': t.capDelayValue.toFixed(1) });
        t.notify('Captions Delay: ' + (t.capDelayValue * 1000).toFixed() + 'ms');
    };
    
    MediaElementPlayer.prototype.incCaptionDelay = function() {
        t.capDelayValue += 0.1;
        capDelayInput.attr({ 'value': t.capDelayValue.toFixed(1) });
        t.notify('Captions Delay: ' + (t.capDelayValue * 1000).toFixed() + 'ms');
    };
    
    MediaElementPlayer.prototype.subdelay = function() {
        var t = this,
            captionSelector = t.captionsButton.find('.mejs-captions-selector');
        
        capDelayInput = $('<input type="number" step="0.1"></input>').on('input', function(e) {
            t.capDelayValue = parseFloat(e.target.value) || 0;
        });
        
        $('<li class="mejs-captionsize"></li>')
            .append($('<label>Caption delay</label>'))
            .append(capDelayInput)
            .appendTo(captionSelector.find('ul'));
        
        t.media.addEventListener('loadeddata', function() {
            capDelayInput.attr({ 'value': 0 });
            t.capDelayValue = 0;
        });
    };
})();
