(function() {
    MediaElementPlayer.prototype.contextmenu = function() {
        var t = this;
        
        chrome.contextMenus.onClicked.addListener(function(info) {
            if(info.parentMenuItemId && info.parentMenuItemId.startsWith('set')) {
                t[info.parentMenuItemId](info.menuItemId);
            }
            else {
                t[info.menuItemId]();
            }
        });
    };
})();
