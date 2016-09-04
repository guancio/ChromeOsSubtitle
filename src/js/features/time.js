(function($) {
    var showRemaining = false;
    
    // current and duration 00:00 / 00:00
    MediaElementPlayer.prototype.current = function() {
        var t = this;
        
        t.rightControls.append($('<div class="mejs-time skip">' +
            '<span class="mejs-currenttime">00:00</span>' +
        '</div>'));
        
        t.time = t.rightControls.find('.mejs-time');
        t.currenttime = t.time.find('.mejs-currenttime');
        
        t.currenttime.on('click', function() {
            if(t.getDuration()) {
                showRemaining = !showRemaining;
                
                t.updateCurrent();
            }
        });
    }
    
    MediaElementPlayer.prototype.duration = function() {
        this.time.append($('<span>/</span>'));
        this.time.append($('<span class="mejs-duration">00:00</span>'));
        
        this.durationD = this.time.find('mejs-duration');
    }
    
    MediaElementPlayer.prototype.updateCurrent = function() {
        if(showRemaining) {
            this.currenttime.html('-' + mejs.Utility.secondsToTimeCode(this.getDuration() - this.getCurrentTime()));
        }
        else {
            this.currenttime.html(mejs.Utility.secondsToTimeCode(this.getCurrentTime()));
        }
    }
    
    MediaElementPlayer.prototype.updateDuration = function() {
        if(this.getDuration()) {
            this.durationD.html(mejs.Utility.secondsToTimeCode(this.getDuration()));
        }
    }
})(mejs.$);
