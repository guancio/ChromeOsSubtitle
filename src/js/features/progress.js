(function($) {
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
            handleMouseMove = function(e) {
                // mouse position relative to the object
                var x = e.pageX,
                    offset = t.railBar.offset(),
                    width = t.railBar.outerWidth(),
                    newTime = 0,
                    pos = 0;
                
                if(t.getSrc()) {
                    if(x < offset.left) {
                        x = offset.left;
                    } else if(x > width + offset.left) {
                        x = width + offset.left;
                    }
                    
                    pos = x - offset.left;
                    newTime = (pos / width) * t.getDuration();
                    
                    // seek to where the mouse is
                    if(mouseIsDown && newTime !== t.getCurrentTime()) {
                        t.setCurrentTime(newTime);
                    }
                    
                    // position floating time box
                    if(!mejs.MediaFeatures.hasTouch && t.getSrc()) {
                        timefloat[0].style.left = pos + 79;  //__UKN#1__ why is 79 needed?
                        timefloatcurrent[0].innerHTML = mejs.Utility.secondsToTimeCode(newTime);
                        timefloat.show();
                    }
                }
            },
            mouseIsDown = false,
            mouseIsOver = false;
        
        // handle clicks
        //controls.find('.mejs-time-rail').delegate('span', 'click', handleMouseMove);
        t.railBar
            .bind('mousedown', function(e) {
                // only handle left clicks
                if(e.which === 1) {
                    mouseIsDown = true;
                    handleMouseMove(e);
                    t.globalBind('mousemove.dur', function(e) {
                        handleMouseMove(e);
                    });
                    t.globalBind('mouseup.dur', function(e) {
                        mouseIsDown = false;
                        timefloat.hide();
                        t.globalUnbind('.dur');
                    });
                    return false;
                }
            })
            .bind('mouseenter', function(e) {
                mouseIsOver = true;
                t.globalBind('mousemove.dur', function(e) {
                    handleMouseMove(e);
                });
                if(!mejs.MediaFeatures.hasTouch && t.getSrc()) {
                    timefloat.show();
                }
            })
            .bind('mouseleave', function(e) {
                mouseIsOver = false;
                if(!mouseIsDown) {
                    t.globalUnbind('.dur');
                    timefloat.hide();
                }
            });
    }
    
    MediaElementPlayer.prototype.setCurrentRail = function() {
        if(this.getSrc()) {
            this.railBar[0].value = this.getCurrentTime() / this.getDuration();
        }
    }
})(mejs.$);
