// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
    init: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        
        // detect browsers (only the ones that have some kind of quirk we need to work around)
        this.isAndroid = (ua.match(/android/i) !== null);
        this.isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);
        this.isChrome = (ua.match(/chrome/gi) !== null);
        this.isWebkit = (ua.match(/webkit/gi) !== null);
        this.hasTouch = ('ontouchstart' in window);
    }
};

mejs.MediaFeatures.init();