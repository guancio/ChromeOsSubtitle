(function($) {
    // progress/loaded bar
    MediaElementPlayer.prototype.buildprogress = function() {
        var t = this;
        
        t.controls[0].appendChild(mejs.Utility.createNestedElement('<div class="mejs-time-rail">' +
                '<span class="mejs-time-total">' +
                    '<span class="mejs-time-buffering"></span>' +
                    '<span class="mejs-time-loaded"></span>' +
                    '<span class="mejs-time-current"></span>' +
                    '<span class="mejs-time-float">' +
                        '<span class="mejs-time-float-current">00:00</span>' +
                        '<span class="mejs-time-float-corner"></span>' +
                    '</span>' +
                '</span>' +
            '</div>'));
        
        t.rail = t.controls.find('.mejs-time-rail');
        t.controls.find('.mejs-time-buffering').hide();
        
        var total = t.controls.find('.mejs-time-total'),
            loaded = t.controls.find('.mejs-time-loaded'),
            current = t.controls.find('.mejs-time-current'),
            timefloat = t.controls.find('.mejs-time-float'),
            timefloatcurrent = t.controls.find('.mejs-time-float-current'),
            handleMouseMove = function(e) {
                // mouse position relative to the object
                var x = e.pageX,
                    offset = total.offset(),
                    width = total.outerWidth(),
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
                    if(!mejs.MediaFeatures.hasTouch) {
                        timefloat[0].style.left = pos;
                        timefloatcurrent[0].innerHTML = mejs.Utility.secondsToTimeCode(newTime);
                        timefloat.show();
                    }
                }
            },
            mouseIsDown = false,
            mouseIsOver = false;
        
        // handle clicks
        //controls.find('.mejs-time-rail').delegate('span', 'click', handleMouseMove);
        total
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
                if(!mejs.MediaFeatures.hasTouch) {
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
        
        // store for later use
        t.loaded = loaded;
        t.total = total;
        t.current = current;
    }
    
    MediaElementPlayer.prototype.setCurrentRail = function() {
        this.current[0].style.width = (parseFloat(this.total[0].style.width) || 0) * this.getCurrentTime() / this.getDuration();
    }
})(mejs.$);
