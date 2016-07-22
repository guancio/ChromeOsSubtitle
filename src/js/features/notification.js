(function($) {
    var activeTimer = null;
    
    MediaElementPlayer.prototype.buildnotification = function(player, controls, layers, media) {
        var notification = $('<div class="mejs-notification"></div>').appendTo($('.mejs-inner')).hide();
    }
    
    MediaElementPlayer.prototype.setNotification = function(text, timeout) {
        $('.mejs-notification').text(text).show();
        this.startNotificationTimer(timeout);
    }
    
    MediaElementPlayer.prototype.startNotificationTimer = function(timeout) {
        if(activeTimer != null)
            clearTimeout(activeTimer);
        
        activeTimer = setTimeout(function() { activeTimer = null; $('.mejs-notification').hide(); }, timeout || 1000);
    }
})(mejs.$);
