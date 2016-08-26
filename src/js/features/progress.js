(function() {
    // progress/loaded bar
    MediaElementPlayer.prototype.buildprogress = function() {
        var t = this;
        
        t.middleControls[0].appendChild(mejs.Utility.createNestedElement('<div class="mejs-time-rail skip">' +
                '<progress id="railBar" min="0" max="1"></progress>' +
                '<span class="mejs-time-float">' +
                    '<span class="mejs-time-float-current">00:00</span>' +
                    '<span class="mejs-time-float-corner"></span>' +
                '</span>' +
            '</div>'));
        
        t.rail = t.middleControls.find('.mejs-time-rail');
        t.railBar = t.rail.find('#railBar');
        
        var timefloat = t.rail.find('.mejs-time-float'),
            timefloatcurrent = timefloat.find('.mejs-time-float-current'),
            handleMouseMove = function(e, mouseDown) {
                // mouse position relative to the object
                var x = e.pageX,
                    offset = t.railBar.offset(),
                    width = t.railBar.outerWidth(),
                    newTime = 0,
                    pos = 0;
                
                if(t.getSrc()) {
                    pos = x - offset.left;
                    newTime = (pos / width) * t.getDuration();
                    
                    // seek to where the mouse is
                    if(mouseDown && newTime !== t.getCurrentTime()) {
                        t.setCurrentTime(newTime);
                    }
                    
                    // position floating time box
                    if(!mejs.MediaFeatures.hasTouch) {
                        timefloat[0].style.left = pos + 39;  //__UKN#1__ why is 79 needed?
                        timefloatcurrent[0].innerHTML = mejs.Utility.secondsToTimeCode(newTime);
                        t.paintThumbnail(newTime);
                    }
                }
            };
        
        // handle clicks
        t.railBar[0].addEventListener('mousemove', function(e) {
            handleMouseMove(e, false);
        });
        t.railBar[0].addEventListener('mousedown', function(e) {
            if(e.which === 1) {
                handleMouseMove(e, true);
            }
        });
    }
    
    MediaElementPlayer.prototype.setCurrentRail = function() {
        if(this.getSrc()) {
            this.railBar[0].value = this.getCurrentTime() / this.getDuration();
        }
    }
})();
