(function() {
    var capDelayInput;
    
    MediaElementPlayer.prototype.changeSubtitleDelay = function(decrease) {
        this.capDelayValue += decrease ? -0.1 : 0.1;
        capDelayInput.attr({ value: this.capDelayValue.toFixed(1) });
        this.notify('Captions Delay: ' + (this.capDelayValue * 1000).toFixed() + 'ms');
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
            capDelayInput.attr({ value: 0 });
            t.capDelayValue = 0;
        });
    };
})();
