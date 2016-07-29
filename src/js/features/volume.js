(function($) {
    $.extend(mejs.MepDefaults, {
        muteText: mejs.i18n.t('Mute Toggle'),
        hideVolumeOnTouchDevices: true,
        
        audioVolume: 'horizontal',
        videoVolume: 'vertical'
    });
    
    MediaElementPlayer.prototype.buildvolume = function() {
        // Android and iOS don't support volume controls
        if(mejs.MediaFeatures.hasTouch && this.hideVolumeOnTouchDevices)
            return;
        
        var t = this,
            mode = (t.isVideo) ? t.options.videoVolume : t.options.audioVolume,
            mute = (mode == 'horizontal') ?
            
            // horizontal version
            $('<div class="mejs-button mejs-volume-button mejs-mute">' +
                '<button type="button" title="' + t.muteText + '" aria-label="' + t.muteText + '"></button>' +
                '</div>' +
                '<div class="mejs-horizontal-volume-slider">' + // outer background
                '<div class="mejs-horizontal-volume-total"></div>' + // line background
                '<div class="mejs-horizontal-volume-current"></div>' + // current volume
                '<div class="mejs-horizontal-volume-handle"></div>' + // handle
                '</div>'
            )
            .appendTo(t.controls) :
            
            // vertical version
            $('<div class="mejs-button mejs-volume-button mejs-mute">' +
                '<button type="button" title="' + t.options.muteText + '" aria-label="' + t.options.muteText + '"></button>' +
                '<div class="mejs-volume-slider">' + // outer background
                '<div class="mejs-volume-total"></div>' + // line background
                '<div class="mejs-volume-current"></div>' + // current volume
                '<div class="mejs-volume-handle"></div>' + // handle
                '</div>' +
                '</div>')
            .appendTo(t.controls),
            volumeSlider = t.container.find('.mejs-volume-slider, .mejs-horizontal-volume-slider'),
            volumeTotal = t.container.find('.mejs-volume-total, .mejs-horizontal-volume-total'),
            volumeCurrent = t.container.find('.mejs-volume-current, .mejs-horizontal-volume-current'),
            volumeHandle = t.container.find('.mejs-volume-handle, .mejs-horizontal-volume-handle'),
            
            positionVolumeHandle = function(volume, secondTry) {
                if(!volumeSlider.is(':visible') && typeof secondTry == 'undefined') {
                    volumeSlider.show();
                    positionVolumeHandle(volume, true);
                    volumeSlider.hide()
                    return;
                }
                
                // correct to 0-1
                volume = Math.min(Math.max(0, volume), 1);
                
                // ajust mute button style
                if(volume == 0) {
                    mute.removeClass('mejs-mute').addClass('mejs-unmute');
                } else {
                    mute.removeClass('mejs-unmute').addClass('mejs-mute');
                }
                
                // position slider 
                if(mode == 'vertical') {
                    var
                    
                    // height of the full size volume slider background
                        totalHeight = volumeTotal.height(),
                        
                        // top/left of full size volume slider background
                        totalPosition = volumeTotal.position(),
                        
                        // the new top position based on the current volume
                        // 70% volume on 100px height == top:30px
                        newTop = totalHeight - (totalHeight * volume);
                        
                    // handle
                    volumeHandle.css('top', Math.round(totalPosition.top + newTop - (volumeHandle.height() / 2)));
                    
                    // show the current visibility
                    volumeCurrent.height(totalHeight - newTop);
                    volumeCurrent.css('top', totalPosition.top + newTop);
                } else {
                    var
                    
                    // height of the full size volume slider background
                        totalWidth = volumeTotal.width(),
                        
                        // top/left of full size volume slider background
                        totalPosition = volumeTotal.position(),
                        
                        // the new left position based on the current volume
                        newLeft = totalWidth * volume;
                        
                    // handle
                    volumeHandle.css('left', Math.round(totalPosition.left + newLeft - (volumeHandle.width() / 2)));
                    
                    // rezize the current part of the volume bar
                    volumeCurrent.width(Math.round(newLeft));
                }
            },
            handleVolumeMove = function(e) {
            
                var volume = null,
                    totalOffset = volumeTotal.offset();
                    
                // calculate the new volume based on the moust position
                if(mode == 'vertical') {
                    var railHeight = volumeTotal.height(),
                        totalTop = parseInt(volumeTotal.css('top').replace(/px/, ''), 10),
                        newY = e.pageY - totalOffset.top;
                        
                    volume = (railHeight - newY) / railHeight;
                    
                    // the controls just hide themselves (usually when mouse moves too far up)
                    if(totalOffset.top == 0 || totalOffset.left == 0)
                        return;
                        
                } else {
                    var railWidth = volumeTotal.width(),
                        newX = e.pageX - totalOffset.left;
                        
                    volume = newX / railWidth;
                }
                
                // ensure the volume isn't outside 0-1
                volume = Math.max(0, Math.min(volume, 1));
                
                // position the slider and handle
                positionVolumeHandle(volume);
                
                // set the media object (this will trigger the volumechanged event)
                volume === 0 ? t.setMuted(true) : t.setMuted(false);
                t.setVolume(volume);
            },
            mouseIsDown = false,
            mouseIsOver = false;
            
        // SLIDER
        
        mute
            .hover(function() {
                volumeSlider.show();
                mouseIsOver = true;
            }, function() {
                mouseIsOver = false;
                
                if(!mouseIsDown && mode == 'vertical') {
                    volumeSlider.hide();
                }
            });
            
        volumeSlider
            .bind('mouseover', function() {
                mouseIsOver = true;
            })
            .bind('mousedown', function(e) {
                handleVolumeMove(e);
                t.globalBind('mousemove.vol', function(e) {
                    handleVolumeMove(e);
                });
                t.globalBind('mouseup.vol', function() {
                    mouseIsDown = false;
                    t.globalUnbind('.vol');
                    
                    if(!mouseIsOver && mode == 'vertical') {
                        volumeSlider.hide();
                    }
                });
                mouseIsDown = true;
                
                return false;
            });
            
        // MUTE button
        mute.find('button').click(function() {
            t.setMuted(!t.isMuted());
        });
        
        // listen for volume change events from other sources
        t.media.addEventListener('volumechange', function(e) {
            if(!mouseIsDown) {
                if(t.isMuted()) {
                    positionVolumeHandle(0);
                    mute.removeClass('mejs-mute').addClass('mejs-unmute');
                } else {
                    positionVolumeHandle(t.getVolume());
                    mute.removeClass('mejs-unmute').addClass('mejs-mute');
                }
            }
        }, false);
        
        if(t.container.is(':visible')) {
            // set initial volume
            positionVolumeHandle(t.options.startVolume);
            
            // mutes the media and sets the volume icon muted if the initial volume is set to 0
            if(t.options.startVolume === 0) {
                t.setMuted(true);
            }
            
            // shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
            if(t.media.pluginType === 'native') {
                t.setVolume(t.options.startVolume);
            }
        }
    }
})(mejs.$);