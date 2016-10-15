(function() {
    MediaElementPlayer.prototype.stats = function() {
        var t = this,
            service = analytics.getService('ice_cream_app'),
            tracker = service.getTracker('UA-46086399-2');
        
        var sendView = function(page) {
            tracker.sendAppView('MainView');
        };
        
        var sendEvent = function(event, p1, p2) {
            tracker.sendEvent(event, p1, p2);
        };
        
        setInterval(function() {
            sendView('MainView');
        }, 60000);
        
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
        
        $(document).on('subtitleEncodingChanged', function(e) {
            sendEvent('subtitle', 'changeEncoding', e.detail);
        });
        $(document).on('subtitleFileOpened', function(e) {
            sendEvent('subtitle', 'openSrtFile', e.detail);
        });
        
        $(document).on('opensubtitlesDownload', function() {
            sendEvent('opensubtitles', 'download');
        });
        
        $('<li/>')
            .append($('<label>Disable analytics</label>'))
            .append($('<input style="margin: 6px" type="checkbox" id="disableAnalytics"/>'))
            .appendTo($('#settings_list'));
        
        var disableCheck = $('#disableAnalytics')
                                .on('click', function(e) {
                                    e.stopPropagation();
                                });
        
        wrnch.storage.get('disableAnalytics', false, function(value) {
            disableCheck.attr({ 'checked': value });
        });
        
        $(document).on('settingsClosed', function() {
            var disabled = disableCheck.attr('checked');
            
            sendEvent('setting', 'disableAnalytics', disabled);
            wrnch.storage.set('disableAnalytics', disabled, function() {
                service.getConfig().addCallback(function(config) {
                    config.setTrackingPermitted(!disabled);
                });
            });
        });
    };
})();
