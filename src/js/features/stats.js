(function($) {
    MediaElementPlayer.prototype.stats = function() {
        var t = this,
            service = null,
            tracker = null;
        
        var sendView = function(page) {
            if (packaged_app) {
                tracker.sendAppView('MainView');
            } else {
                ga('send', 'pageview');
            }
        }
        
        var sendEvent = function(event, p1, p2) {
            if (packaged_app) {
                tracker.sendEvent(event, p1, p2);
            } else {
                ga('send', 'event', event, p1, p2);
            }
        }
        
        if (packaged_app) {
            service = analytics.getService('ice_cream_app');
            tracker = service.getTracker('UA-46086399-2');
        }
        else {
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            
            ga('create', 'UA-46086399-1', 'auto');
            ga('send', 'pageview');
        }
        
        var refresher = function() {
                sendView('MainView');
                setTimeout(refresher, 60000);
            };
        
        $(document).on('appStarted', function() {
            refresher();
        });
        
        t.media.addEventListener('loadeddata', function() {
            sendEvent('video', 'loaded', t.playlist[t.playIndex].name);
        });
        t.media.addEventListener('playing', function() {
            sendEvent('video', 'playing');
        });
        t.media.addEventListener('paused', function() {
            sendEvent('video', 'paused');
        });
        
        // settings
        // info
        // help
        // sub size
        // sub delay
        // change zip file
        // change selected srt entry
        // fullscreen
        // drop
        
        $(document).on("subtitleEncodingChanged", function(e, enc) {
            sendEvent('subtitle', 'changeEncoding', enc);
        });
        $(document).on("subtitleFileOpened", function(e, name) {
            sendEvent('subtitle', 'openSrtFile', name);
        });
        
        $(document).on("opensubtitlesDownload", function() {
            sendEvent('opensubtitles', 'download');
        });
        
        var settingsList = $('#settings_list'),
            disableCheck = $('#disableAnalytics');
        
        $('<li/>')
            .appendTo(settingsList)
            .append($('<label style="width:250px; float:left;">Disable analytics</label>'))
            .append($('<input type="checkbox" id="disableAnalytics"/>'));
        
        disableCheck.on('click', function(e) {
            e.stopPropagation();
        });
        
        var disabled = false;
        
        mejs.Utility.getFromSettings('disableAnalytics', false, function(value) {
            disableCheck.attr({ 'checked': value });
            disabled = value;
        });
        
        $(document).on("settingsClosed", function() {
            var disabled = disableCheck.attr('checked');
            
            sendEvent('setting', 'disableAnalytics', disabled);
            mejs.Utility.setIntoSettings('disableAnalytics', disabled, function() {
                service.getConfig().addCallback(function(config) {
                    config.setTrackingPermitted(!disabled);
                });
            });
        });
    }
})(mejs.$);
