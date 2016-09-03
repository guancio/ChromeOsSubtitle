(function($) {
    $.extend(mejs.MepDefaults, {
        muteText: mejs.i18n.t('Mute Toggle'),
        maximumVolume: 2
    });
    
    MediaElementPlayer.prototype.volume = function() {
        var audioContext = new window.AudioContext(),
            source = audioContext.createMediaElementSource(this.media);
        
        this.gainNode = audioContext.createGain();
        this.delayNode = audioContext.createDelay(2.0);
        
        source.connect(this.delayNode);
        this.delayNode.connect(this.gainNode);
        this.gainNode.connect(audioContext.destination);
        
        var t = this,
            mute = $('<div class="mejs-button mejs-volume-button mejs-mute">' +
                    '<button type="button" title="' + t.options.muteText + '" aria-label="' + t.options.muteText + '"></button>' +
                    '<progress id="volumeBar" value="' + t.options.startVolume + '" max="' + t.options.maximumVolume + '"></progress>' +
                '</div>')
            .appendTo(t.rightControls),
            volumeBar = t.container.find('#volumeBar'),
            handleVolumeMove = function(e) {
                var volume = null,
                    totalOffset = volumeBar.offset();
                
                // calculate the new volume based on the mouse position
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
            };
        
        volumeBar[0].addEventListener('mousedown', function(e) {
            handleVolumeMove(e);
            volumeBar[0].addEventListener('mousemove', handleVolumeMove);
        });
        volumeBar[0].addEventListener('mouseup', function() {
            volumeBar[0].removeEventListener('mousemove', handleVolumeMove);
        });
        volumeBar[0].addEventListener('mouseleave', function() {
            volumeBar[0].removeEventListener('mousemove', handleVolumeMove);
        });
        
        // MUTE button
        mute.find('button').click(function() {
            t.setMuted(!t.isMuted());
        });
        
        // listen for volume change events from other sources
        t.media.addEventListener('volumechange', function(e) {
            if(t.isMuted()) {
                volumeBar[0].value = 0;
                mute.removeClass('mejs-mute').addClass('mejs-unmute');
            } else {
                volumeBar[0].value = t.getVolume();
                mute.removeClass('mejs-unmute').addClass('mejs-mute');
            }
        }, false);
        
        t.setVolume(t.options.startVolume);
    }
})(mejs.$);