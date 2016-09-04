/*
 * Google Analytics Plugin
 * Requires
 *
 */
(function() {
    $.extend(mejs.MepDefaults, {
        googleAnalyticsTitle: '',
        googleAnalyticsCategory: 'Videos',
        googleAnalyticsEventPlay: 'Play',
        googleAnalyticsEventPause: 'Pause',
        googleAnalyticsEventEnded: 'Ended',
        googleAnalyticsEventTime: 'Time'
    });
    
    MediaElementPlayer.prototype.googleanalytics = function() {
        this.media.addEventListener('play', function() {
            if(typeof _gaq != 'undefined') {
                _gaq.push(['_trackEvent',
                    this.options.googleAnalyticsCategory,
                    this.options.googleAnalyticsEventPlay,
                    (this.options.googleAnalyticsTitle === '') ? this.currentSrc : this.options.googleAnalyticsTitle
                ]);
            }
        }, false);
        
        this.media.addEventListener('pause', function() {
            if(typeof _gaq != 'undefined') {
                _gaq.push(['_trackEvent',
                    this.options.googleAnalyticsCategory,
                    this.options.googleAnalyticsEventPause,
                    (this.options.googleAnalyticsTitle === '') ? this.currentSrc : this.options.googleAnalyticsTitle
                ]);
            }
        }, false);
        
        this.media.addEventListener('ended', function() {
            if(typeof _gaq != 'undefined') {
                _gaq.push(['_trackEvent',
                    this.options.googleAnalyticsCategory,
                    this.options.googleAnalyticsEventEnded,
                    (this.options.googleAnalyticsTitle === '') ? this.currentSrc : this.options.googleAnalyticsTitle
                ]);
            }
        }, false);
    }
})();