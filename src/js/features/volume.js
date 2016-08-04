(function($) {
    $.extend(mejs.MepDefaults, {
        muteText: mejs.i18n.t('Mute Toggle'),
        hideVolumeOnTouchDevices: true,
        maximumVolume: 2
    });
    
    MediaElementPlayer.prototype.buildvolume = function() {
        var audioContext = new window.AudioContext(),
            source = audioContext.createMediaElementSource(this.media);
        
        this.gainNode = audioContext.createGain();
        source.connect(this.gainNode);
        this.gainNode.connect(audioContext.destination);
        
        // Android and iOS don't support volume controls
        if(mejs.MediaFeatures.hasTouch && this.hideVolumeOnTouchDevices)
            return;
        
        var t = this,
            mute = $('<div class="mejs-button mejs-volume-button mejs-mute">' +
                    '<button type="button" title="' + t.options.muteText + '" aria-label="' + t.options.muteText + '"></button>' +
                    '<progress id="volumeBar" value="' + t.options.startVolume * 100 + '" max="' + t.options.maximumVolume * 100 + '"></progress>' +
                '</div>')
            .appendTo(t.controls),
            volumeBar = t.container.find('#volumeBar');
            
            positionVolumeHandle = function(volume) {
                volumeBar[0].value = volume * 100;
            },
            handleVolumeMove = function(e) {
                var volume = null,
                    totalOffset = volumeBar.offset();
                
                // calculate the new volume based on the moust position
                // height is width becuase we have rotated the progress bar
                var railHeight = volumeBar.width(),
                    newY = e.pageY - totalOffset.top;
                
                volume = (railHeight - newY) / railHeight;
                
                // the controls just hide themselves (usually when mouse moves too far up)
                if(totalOffset.top == 0 || totalOffset.left == 0)
                    return;
                
                // ensure the volume isn't outside 0-2
                // set the media object (this will trigger the volumechanged event)
                t.setVolume(Math.max(0, Math.min(volume * 2, t.options.maximumVolume)));
            },
            mouseIsDown = false,
            mouseIsOver = false;
        
        // SLIDER
        mute.hover(function() {
                volumeBar.show();
                mouseIsOver = true;
            }, function() {
                mouseIsOver = false;
                
                if(!mouseIsDown) {
                    volumeBar.hide();
                }
            });
        
        volumeBar.bind('mouseover', function() {
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
                    
                    if(!mouseIsOver) {
                        volumeBar.hide();
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
            if(t.isMuted()) {
                positionVolumeHandle(0);
                mute.removeClass('mejs-mute').addClass('mejs-unmute');
            } else {
                positionVolumeHandle(t.getVolume());
                mute.removeClass('mejs-unmute').addClass('mejs-mute');
            }
        }, false);
        
        if(t.container.is(':visible')) {
            t.setVolume(t.options.startVolume);
        }
    }
})(mejs.$);