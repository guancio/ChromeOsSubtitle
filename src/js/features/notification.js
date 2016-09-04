(function($) {
    var activeTimer = null;
    
    MediaElementPlayer.prototype.notification = function() {
        this.notification = $('<div class="mejs-notification"></div>');
        this.notification.css({ 'visibility': 'hidden' });
        this.notification.appendTo(document.getElementsByClassName('mejs-container')[0])
    };
    
    MediaElementPlayer.prototype.notify = function(text, timeout) {
        this.notification.text(text);
        this.notification.css({ 'visibility': 'visible' });
        this.startNotificationTimer(timeout);
    };
    
    MediaElementPlayer.prototype.startNotificationTimer = function(timeout) {
        var t = this;
        
        if(activeTimer !== null) {
            clearTimeout(activeTimer);
        }
        
        activeTimer = setTimeout(function() {
            activeTimer = null;
            t.notification.css({ 'visibility': 'hidden' });
        }, timeout || 1000);
    };
})(mejs.$);
