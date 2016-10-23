(function() {
    var time,
        durationD,
        currenttime,
        showRemaining = false;
    
    // current and duration 00:00 / 00:00
    MediaElementPlayer.prototype.current = function() {
        var t = this;
        
        t.rightControls.append($('<div class="mejs-time">' +
            '<span class="mejs-currenttime">00:00</span>' +
        '</div>'));
        
        time = t.rightControls.find('.mejs-time');
        currenttime = time.find('.mejs-currenttime');
        
        currenttime.on('click', function() {
            if(t.getDuration()) {
                showRemaining = !showRemaining;
                
                t.updateCurrent();
            }
        });
    };
    
    MediaElementPlayer.prototype.duration = function() {
        time
            .append($('<span>/</span>'))
            .append($('<span class="mejs-duration">00:00</span>'));
        
        durationD = time.find('.mejs-duration');
    };
    
    MediaElementPlayer.prototype.updateCurrent = function() {
        if(showRemaining) {
            currenttime.html('-' + wrnch.secondsToTimeCode(this.getDuration() - this.getCurrentTime()));
        }
        else {
            currenttime.html(wrnch.secondsToTimeCode(this.getCurrentTime()));
        }
    };
    
    MediaElementPlayer.prototype.updateDuration = function() {
        durationD.html(wrnch.secondsToTimeCode(this.getDuration()));
    };
})();
