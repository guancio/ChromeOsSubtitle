(function($) {
    // progress/loaded bar
    MediaElementPlayer.prototype.buildprogress = function() {
        var t = this;
        
        t.controls[0].appendChild(mejs.Utility.createNestedElement('<div class="mejs-time-rail">' +
                '<span class="mejs-time-total">' +
                    '<span class="mejs-time-buffering"></span>' +
                    '<span class="mejs-time-loaded"></span>' +
                    '<span class="mejs-time-current"></span>' +
                    '<span class="mejs-time-handle"></span>' +
                    '<span class="mejs-time-float">' +
                        '<span class="mejs-time-float-current">00:00</span>' +
                        '<span class="mejs-time-float-corner"></span>' +
                    '</span>' +
                '</span>' +
            '</div>'));
        
        t.controls.find('.mejs-time-buffering').hide();
        
        var total = t.controls.find('.mejs-time-total'),
            loaded = t.controls.find('.mejs-time-loaded'),
            current = t.controls.find('.mejs-time-current'),
            handle = t.controls.find('.mejs-time-handle'),
            timefloat = t.controls.find('.mejs-time-float'),
            timefloatcurrent = t.controls.find('.mejs-time-float-current'),
            handleMouseMove = function(e) {
                // mouse position relative to the object
                var x = e.pageX,
                    offset = total.offset(),
                    width = total.outerWidth(),
                    newTime = 0,
                    pos = 0;
                
                if(t.getDuration()) {
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
        
        // loading
        t.media.addEventListener('progress', function(e) {
            if(!t.controlsAreVisible)
                return;
            
            t.setProgressRail(e);
            t.setCurrentRail(e);
        });
        
        // current time
        t.media.addEventListener('timeupdate', function(e) {
            if(!t.controlsAreVisible)
                return;
            
            t.setProgressRail(e);
            t.setCurrentRail(e);
        });
        
        // store for later use
        t.loaded = loaded;
        t.total = total;
        t.current = current;
        t.handle = handle;
    }
    
    MediaElementPlayer.prototype.setProgressRail = function(e) {
        var
            t = this,
            target = (e != undefined) ? e.target : t.media,
            percent = null;
        
        // newest HTML5 spec has buffered array (FF4, Webkit)
        if(target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
            // TODO: account for a real array with multiple values (only Firefox 4 has this so far) 
            percent = target.buffered.end(0) / target.duration;
        }
        
        // finally update the progress bar
        if(percent !== null) {
            percent = Math.min(1, Math.max(0, percent));
            // update loaded bar
            if(t.loaded && t.total) {
                t.loaded[0].style.width = (parseFloat(t.total[0].style.width) || 0) * percent;
            }
        }
    }
    
    MediaElementPlayer.prototype.setCurrentRail = function() {
        var t = this;
        
        if(t.getCurrentTime() != undefined && t.getDuration()) {
            // update bar and handle
            if(t.total && t.handle) {
                var newWidth = (parseFloat(t.total[0].style.width) || 0) * t.getCurrentTime() / t.getDuration(),
                    handlePos = newWidth - t.handle.outerWidth(true) / 2;
                
                t.current[0].style.width = newWidth;
                t.handle[0].style.left = handlePos;
            }
        }
    }
})(mejs.$);