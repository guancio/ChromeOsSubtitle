(function($) {
    $.extend(mejs.MepDefaults, {
        fullscreenText: mejs.i18n.t('Fullscreen')
    });
    
    MediaElementPlayer.prototype.buildfullscreen = function() {
        if(!this.isVideo)
            return;
        
        var t = this,
            fullscreenBtn = mejs.Utility.createNestedElement('<div class="mejs-button mejs-fullscreen-button">' +
                '<button type="button" title="' + this.options.fullscreenText + '" aria-label="' + this.options.fullscreenText + '"></button>' +
                '</div>');
        
        fullscreenBtn.addEventListener('click', function() {
            if(document.webkitIsFullScreen) {
                t.exitFullScreen();
            } else {
                t.enterFullScreen();
            }
        });
        
        t.controls[0].appendChild(fullscreenBtn);
        
        document.addEventListener("webkitfullscreenchange", function() {
            if(document.webkitIsFullScreen) {
                fullscreenBtn.className = 'mejs-button mejs-fullscreen-button mejs-unfullscreen';
            }
            else {
                fullscreenBtn.className = 'mejs-button mejs-fullscreen-button';
            }
            
            t.setControlsSize();
        }, false);
    }
    
    MediaElementPlayer.prototype.enterFullScreen = function() {
        this.container[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    
    MediaElementPlayer.prototype.exitFullScreen = function() {
        document.webkitCancelFullScreen();
    }
})(mejs.$);