(function() {
    var showRemaining = false;
    
    // current and duration 00:00 / 00:00
    MediaElementPlayer.prototype.current = function() {
        var t = this;
        
        t.rightControls[0].appendChild(mejs.Utility.createNestedElement('<div class="mejs-time skip">' +
            '<span class="mejs-currenttime">00:00</span>' +
        '</div>'));
        
        t.time = t.rightControls[0].getElementsByClassName('mejs-time')[0];
        t.currenttime = t.time.getElementsByClassName('mejs-currenttime')[0];
        
        t.currenttime.addEventListener('click', function() {
            if(t.getDuration()) {
                showRemaining = !showRemaining;
                
                t.updateCurrent();
            }
        });
    }
    
    MediaElementPlayer.prototype.duration = function() {
        this.time.appendChild(mejs.Utility.createNestedElement('<span>/</span>'));
        this.time.appendChild(mejs.Utility.createNestedElement('<span class="mejs-duration">00:00</span>'));
        
        this.durationD = this.time.getElementsByClassName('mejs-duration')[0];
    }
    
    MediaElementPlayer.prototype.updateCurrent = function() {
        if(showRemaining) {
            this.currenttime.innerHTML = '-' + mejs.Utility.secondsToTimeCode(this.getDuration() - this.getCurrentTime());
        }
        else {
            this.currenttime.innerHTML = mejs.Utility.secondsToTimeCode(this.getCurrentTime());
        }
    }
    
    MediaElementPlayer.prototype.updateDuration = function() {
        if(this.getDuration()) {
            this.durationD.innerHTML = mejs.Utility.secondsToTimeCode(this.getDuration());
        }
    }
})();
