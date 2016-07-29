(function($) {
    var activeTimer = null;
    
    MediaElementPlayer.prototype.buildnotification = function() {
        this.notification = mejs.Utility.createNestedElement('<div class="mejs-notification"></div>');
        this.notification.style.visibility = 'hidden';
        document.getElementsByClassName('mejs-inner')[0].appendChild(this.notification);
    }
    
    MediaElementPlayer.prototype.setNotification = function(text, timeout) {
        this.notification.innerText = text;
        this.notification.style.visibility = 'visible';
        this.startNotificationTimer(timeout);
    }
    
    MediaElementPlayer.prototype.startNotificationTimer = function(timeout) {
        var t = this;
        
        if(activeTimer !== null)
            clearTimeout(activeTimer);
        
        activeTimer = setTimeout(function() { activeTimer = null; t.notification.style.visibility = 'hidden'; }, timeout || 1000);
    }
})(mejs.$);
