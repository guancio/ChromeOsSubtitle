(function() {
    var currentAspectRatio = 0,
        aspectRatios = [null, 1, 1.333333, 1.777778, 1.666666, 2.21, 2.35, 2.39, 1.25],
        aspectRatiosText = ['Default', '1:1', '4:3', '16:9', '16:10', '2.21:1', '2.35:1', '2.39:1', '5:4'];
    
    MediaElementPlayer.prototype.resizeVideo = function() {
        var targetAspectRatio,
            wH = window.innerHeight,
            wW = window.innerWidth;
        
        if(currentAspectRatio === 0) {
            targetAspectRatio = this.media.videoWidth / this.media.videoHeight;
        }
        else {
            targetAspectRatio = aspectRatios[currentAspectRatio];
        }
        
        if(wH * targetAspectRatio <= wW) {
            //$(this.media).css('-webkit-transform', 'scale(' + (wH * targetAspectRatio) / this.media.videoWidth + ',' + wH / this.media.videoHeight + ')');
            this.media.style.width = wH * targetAspectRatio;
            this.media.style.height = wH;
        }
        else {
            //$(this.media).css('-webkit-transform', 'scale(' + wW / this.media.videoWidth + ',' + wW / (targetAspectRatio * this.media.videoHeight) + ')');
            this.media.style.width = wW;
            this.media.style.height = wW / targetAspectRatio;
        }
    };
    
    MediaElementPlayer.prototype.setAspectRatio = function(value) {
        currentAspectRatio = parseInt(value);
        this.resizeVideo();
        this.notify('Aspect Ratio: ' + aspectRatiosText[currentAspectRatio]);
        chrome.contextMenus.update(currentAspectRatio + 'a', { 'checked': true });
    };
    
    MediaElementPlayer.prototype.cycleAspectRatio = function() {
        this.setAspectRatio((currentAspectRatio + 1)  % aspectRatios.length);
    };
})();