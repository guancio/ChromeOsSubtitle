// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
    init: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        
        // detect browsers (only the ones that have some kind of quirk we need to work around)
        this.isAndroid = (ua.match(/android/i) !== null);
        this.hasTouch = ('ontouchstart' in window);
    }
};

mejs.MediaFeatures.init();