// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
    init: function() {
        // detect browsers (only the ones that have some kind of quirk we need to work around)
        this.hasTouch = ('ontouchstart' in window);
    }
};

mejs.MediaFeatures.init();