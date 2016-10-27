(function() {
    var fullscreenText = chrome.i18n.getMessage('fullscreen');
    
    MediaElementPlayer.prototype.fullscreen = function() {
        var t = this,
            fullscreenBtn = $('<div class="mejs-button mejs-fullscreen">' +
                    '<button type="button" title="' + fullscreenText + '"></button>' +
                '</div>').on('click', function() {
                    t.toggleFullscreen();
                }).appendTo(t.rightControls);
        
        $(document).on('webkitfullscreenchange', function() {
            fullscreenBtn.toggleClass('mejs-unfullscreen');
        }, false);
    };
    
    MediaElementPlayer.prototype.toggleFullscreen = function() {
        document.webkitIsFullScreen ? document.webkitCancelFullScreen() : this.container.get().webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    };
})();
