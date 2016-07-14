// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
    init: function() {
        var
            t = this,
            d = document,
            nav = mejs.PluginDetector.nav,
            ua = mejs.PluginDetector.ua.toLowerCase(),
            i,
            v,
            html5Elements = ['source', 'track', 'audio', 'video'];
        
        // detect browsers (only the ones that have some kind of quirk we need to work around)
        t.isAndroid = (ua.match(/android/i) !== null);
        t.isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);
        t.isBustedNativeHTTPS = (location.protocol === 'https:' && (ua.match(/android [12]\./) !== null || ua.match(/macintosh.* version.* safari/) !== null));
        t.isChrome = (ua.match(/chrome/gi) !== null);
        t.isWebkit = (ua.match(/webkit/gi) !== null);
        t.isGecko = (ua.match(/gecko/gi) !== null) && !t.isWebkit;
        t.isOpera = (ua.match(/opera/gi) !== null);
        t.hasTouch = ('ontouchstart' in window);
        
        // borrowed from Modernizr
        t.svg = !!document.createElementNS &&
            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
        
        // create HTML5 media elements for IE before 9, get a <video> element for fullscreen detection
        for(i = 0; i < html5Elements.length; i++) {
            v = document.createElement(html5Elements[i]);
        }
        
        t.supportsMediaTag = (typeof v.canPlayType !== 'undefined' || t.isBustedAndroid);
        
        // detect native JavaScript fullscreen (Safari/Firefox only, Chrome still fails)
        
        // iOS
        t.hasSemiNativeFullScreen = (typeof v.webkitEnterFullscreen !== 'undefined');
        
        // Webkit/firefox
        t.hasWebkitNativeFullScreen = (typeof v.webkitRequestFullScreen !== 'undefined');
        t.hasMozNativeFullScreen = (typeof v.mozRequestFullScreen !== 'undefined');
        
        t.hasTrueNativeFullScreen = (t.hasWebkitNativeFullScreen || t.hasMozNativeFullScreen);
        t.nativeFullScreenEnabled = t.hasTrueNativeFullScreen;
        if(t.hasMozNativeFullScreen) {
            t.nativeFullScreenEnabled = v.mozFullScreenEnabled;
        }
        
        if(this.isChrome) {
            t.hasSemiNativeFullScreen = false;
        }
        
        if(t.hasTrueNativeFullScreen) {
            t.fullScreenEventName = (t.hasWebkitNativeFullScreen) ? 'webkitfullscreenchange' : 'mozfullscreenchange';
            
            t.isFullScreen = function() {
                if(v.mozRequestFullScreen) {
                    return d.mozFullScreen;
                } else if(v.webkitRequestFullScreen) {
                    return d.webkitIsFullScreen;
                }
            }
            
            t.requestFullScreen = function(el) {
                if(t.hasWebkitNativeFullScreen) {
                    el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if(t.hasMozNativeFullScreen) {
                    el.mozRequestFullScreen();
                }
            }
            
            t.cancelFullScreen = function() {
                if(t.hasWebkitNativeFullScreen) {
                    document.webkitCancelFullScreen();
                } else if(t.hasMozNativeFullScreen) {
                    document.mozCancelFullScreen();
                }
            }
        }
    }
};
mejs.MediaFeatures.init();