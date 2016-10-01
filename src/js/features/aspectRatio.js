(function() {
    var currentAspectRatio,
        aspectRatios = [null, 1, 1.333333, 1.777778, 1.666666, 2.21, 2.35, 2.39, 1.25],
        aspectRatiosText = ['Default', '1:1', '4:3', '16:9', '16:10', '2.21:1', '2.35:1', '2.39:1', '5:4'];
    
    wrnch.storage.get('aspectRatio', 0, function(value) {
        currentAspectRatio = value;
    });
    
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
        
        //Use viewport sizes.
        //      wH * targetAspectRatio => (targetAspectRatio * 100) vh
        //      wH                     => 100 vh
        //      wW                     => 100 vw
        //      wW / targetAspectRatio => (100 / targetAspectRatio) vw
        if(wH * targetAspectRatio <= wW) {
            this.media.style.width = (targetAspectRatio * 100) + 'vh';
            this.media.style.height = '100vh';
        }
        else {
            this.media.style.width = '100vw';
            this.media.style.height = (100 / targetAspectRatio) + 'vw';
        }
    };
    
    MediaElementPlayer.prototype.setAspectRatio = function(value) {
        chrome.contextMenus.update(currentAspectRatio + 'a', { 'checked': false });
        
        currentAspectRatio = parseInt(value);
        this.resizeVideo();
        this.notify('Aspect Ratio: ' + aspectRatiosText[currentAspectRatio]);
        
        chrome.contextMenus.update(currentAspectRatio + 'a', { 'checked': true });
        
        wrnch.storage.set('aspectRatio', currentAspectRatio);
    };
    
    MediaElementPlayer.prototype.cycleAspectRatio = function() {
        this.setAspectRatio((currentAspectRatio + 1)  % aspectRatios.length);
    };
})();
