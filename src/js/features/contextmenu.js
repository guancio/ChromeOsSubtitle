(function() {
    var aspectRatiosText = ['Default', '1:1', '4:3', '16:9', '16:10', '2.21:1', '2.35:1', '2.39:1', '5:4'];
    
    MediaElementPlayer.prototype.buildcontextmenu = function() {
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