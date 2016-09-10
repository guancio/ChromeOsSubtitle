(function() {
    var activeTimer = null;
    
    MediaElementPlayer.prototype.notification = function() {
        this.notification = $('<div class="mejs-notification"></div>')
                                .hide()
                                .appendTo(this.container);
    };
    
    MediaElementPlayer.prototype.notify = function(text, timeout) {
        this.notification
            .text(text)
            .show();
        
        this.startNotificationTimer(timeout);
    };
    
    MediaElementPlayer.prototype.startNotificationTimer = function(timeout) {
        var t = this;
        
        if(activeTimer !== null) {
            clearTimeout(activeTimer);
        }
        
        activeTimer = setTimeout(function() {
            activeTimer = null;
            t.notification.hide();
        }, timeout || 1000);
    };
})();
