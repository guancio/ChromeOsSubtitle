(function($) {
    var showRemaining = false;
    
    // current and duration 00:00 / 00:00
    MediaElementPlayer.prototype.buildcurrent = function() {
        var t = this;
        
        t.rightControls[0].appendChild(mejs.Utility.createNestedElement('<div class="mejs-time skip">' +
            '<span class="mejs-currenttime">00:00</span>' +
        '</div>'));
        
        t.time = t.rightControls.find('.mejs-time');
        t.currenttime = t.time.find('.mejs-currenttime');
        
        t.currenttime[0].addEventListener('click', function() {
            if(t.getDuration()) {
                showRemaining = !showRemaining;
                
                t.updateCurrent();
            }
        });
    }
    
    MediaElementPlayer.prototype.buildduration = function() {
        $('<span>/</span><span class="mejs-duration">00:00</span>')
            .appendTo(this.time);
        
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
