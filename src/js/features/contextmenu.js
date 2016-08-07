(function($) {
    MediaElementPlayer.prototype.buildcontextmenu = function() {
        var t = this;
        
        function genericOnClick(info) {
            if(info.parentMenuItemId === 'setPlaybackRate') {
                t[info.parentMenuItemId](info.menuItemId);
            }
            else if(info.parentMenuItemId === 'setAspectRatio') {
                t[info.parentMenuItemId](info.menuItemId);
            }
            else if(info.parentMenuItemId === 'setPlayType') {
                t[info.parentMenuItemId](info.menuItemId);
            }
            else {
                console.log(info);
                t[info.menuItemId]();
            }
        }
        
        chrome.contextMenus.create({ 'title': 'Open Media', 'id': 'openFileForm' });
        chrome.contextMenus.create({ 'title': 'Toggle Fullscreen', 'id': 'toggleFullscreen' });
        
        chrome.contextMenus.create({ 'title': 'Playback Rate', 'id': 'playbackRate' });
            chrome.contextMenus.create({ 'title': 'Set', 'parentId': 'playbackRate', 'id': 'setPlaybackRate' });
                chrome.contextMenus.create({ 'title': '50%', 'parentId': 'setPlaybackRate', 'id': '0.50' });
                chrome.contextMenus.create({ 'title': '150%', 'parentId': 'setPlaybackRate', 'id': '1.50' });
                chrome.contextMenus.create({ 'title': '200%', 'parentId': 'setPlaybackRate', 'id': '2.00' });
            chrome.contextMenus.create({ 'title': 'Increase', 'parentId': 'playbackRate', 'id': 'incPlaybackRate' });
            chrome.contextMenus.create({ 'title': 'Decrease', 'parentId': 'playbackRate', 'id': 'decPlaybackRate' });
            chrome.contextMenus.create({ 'title': 'Reset', 'parentId': 'playbackRate', 'id': 'resetPlaybackRate' });
        
        chrome.contextMenus.create({ 'title': 'Aspect Ratio', 'id': 'setAspectRatio' });
            chrome.contextMenus.create({ 'title': 'Default', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '0a' });
            chrome.contextMenus.create({ 'title': '1:1', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '1a' });
            chrome.contextMenus.create({ 'title': '4:3', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '2a' });
            chrome.contextMenus.create({ 'title': '16:9', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '3a' });
            chrome.contextMenus.create({ 'title': '16:10', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '4a' });
            chrome.contextMenus.create({ 'title': '2.21:1', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '5a' });
            chrome.contextMenus.create({ 'title': '2.35:1', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '6a' });
            chrome.contextMenus.create({ 'title': '2.39:1', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '7a' });
            chrome.contextMenus.create({ 'title': '5:4', 'type': 'radio', 'parentId': 'setAspectRatio', 'id': '8a' });
          
        chrome.contextMenus.create({ 'title': 'Download Subtitles', 'id': 'openSubtitleLogIn' });
        
        chrome.contextMenus.create({ 'title': 'Caption Size', 'id': 'captionSize' });
            chrome.contextMenus.create({ 'title': 'Increase', 'parentId': 'captionSize', 'id': 'incCaptionSize' });
            chrome.contextMenus.create({ 'title': 'Decrease', 'parentId': 'captionSize', 'id': 'decCaptionSize' });
        
        chrome.contextMenus.create({ 'title': 'Playlist', 'id': 'playlist' });
            chrome.contextMenus.create({ 'title': 'Set Navigation', 'parentId': 'playlist', 'id': 'setPlayType' });
                chrome.contextMenus.create({ 'title': 'Normal', 'type': 'radio', 'parentId': 'setPlayType', 'id': '0p' });
                chrome.contextMenus.create({ 'title': 'Repeat', 'type': 'radio', 'parentId': 'setPlayType', 'id': '1p' });
                chrome.contextMenus.create({ 'title': 'Shuffle', 'type': 'radio', 'parentId': 'setPlayType', 'id': '2p' });
            chrome.contextMenus.create({ 'title': 'Next Media', 'parentId': 'playlist', 'id': 'next' });
            chrome.contextMenus.create({ 'title': 'Previous Media', 'parentId': 'playlist', 'id': 'previous' });
        
        chrome.contextMenus.create({ 'title': 'Help', 'id': 'openHelpWindow' });
        
        chrome.contextMenus.onClicked.addListener(genericOnClick);

    };
})(mejs.$);