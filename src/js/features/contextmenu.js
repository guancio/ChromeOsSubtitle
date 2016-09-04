(function() {
    MediaElementPlayer.prototype.contextmenu = function() {
        if(!packaged_app) {
            return;
        }
        
        var t = this;
        
        function contextCallback(info) {
            if(info.parentMenuItemId && info.parentMenuItemId.startsWith('set')) {
                t[info.parentMenuItemId](info.menuItemId);
            }
            else {
                t[info.menuItemId]();
            }
        }
        
        chrome.contextMenus.onClicked.addListener(contextCallback);
    };
})();