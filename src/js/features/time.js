(function($) {
    var showRemaining = false;
    
    // current and duration 00:00 / 00:00
    MediaElementPlayer.prototype.buildcurrent = function() {
        var t = this;
        
        $('<div class="mejs-time">' +
            '<span class="mejs-currenttime">00:00</span>' +
        '</div>')
            .appendTo(t.controls);
        
        t.currenttime = t.controls.find('.mejs-currenttime');
        
        t.media.addEventListener('timeupdate', function() {
            if(!t.controlsAreVisible)
                return;
            
            t.updateCurrent();
        }, false);
        
        t.currenttime[0].addEventListener('click', function() {
            showRemaining = !showRemaining;
            
            if(t.isPaused())
                t.updateCurrent();
            
            t.setControlsSize();
        })
    }
    
    MediaElementPlayer.prototype.buildduration = function() {
        $('<span>/</span><span class="mejs-duration">00:00</span>')
            .appendTo(this.controls.find('.mejs-time'));
        
        this.durationD = this.controls.find('.mejs-duration');
    }
    
    MediaElementPlayer.prototype.updateCurrent = function() {
        if(this.currenttime) {
            if(showRemaining) {
                this.currenttime.html('-' + mejs.Utility.secondsToTimeCode(this.getDuration() - this.getCurrentTime()));
            }
            else {
                this.currenttime.html(mejs.Utility.secondsToTimeCode(this.getCurrentTime()));
            }
        }
    }
    
    MediaElementPlayer.prototype.updateDuration = function() {
        //Toggle the long video class if the video is longer than an hour.
        this.container.toggleClass("mejs-long-video", this.getDuration() > 3600);
        
        if(this.durationD && this.getDuration()) {
            this.durationD.html(mejs.Utility.secondsToTimeCode(this.getDuration()));
        }
    }
})(mejs.$);