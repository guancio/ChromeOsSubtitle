chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create('index.html', {bounds: {width: 1040, height: 600}}, function(win) {
    win.contentWindow.launchData = launchData;
  });
});

chrome.runtime.onInstalled.addListener(function() {
    var temp = ['Default', '1:1', '4:3', '16:9', '16:10', '2.21:1', '2.35:1', '2.39:1', '5:4'];
    
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
        for(var i = 0; i < temp.length; i++) {
            chrome.contextMenus.create({ 'title': temp[i], 'type': 'radio', 'parentId': 'setAspectRatio', 'id': i + 'a' });
        }
    
    chrome.contextMenus.create({ 'title': 'Download Subtitles', 'id': 'openSubtitleLogIn' });
    
    chrome.contextMenus.create({ 'title': 'Caption Size', 'id': 'captionSize' });
        chrome.contextMenus.create({ 'title': 'Increase', 'parentId': 'captionSize', 'id': 'incCaptionSize' });
        chrome.contextMenus.create({ 'title': 'Decrease', 'parentId': 'captionSize', 'id': 'decCaptionSize' });
    
    chrome.contextMenus.create({ 'title': 'Playlist', 'id': 'playlist' });
        chrome.contextMenus.create({ 'title': 'Navigation', 'parentId': 'playlist', 'id': 'setPlayType' });
            chrome.contextMenus.create({ 'title': 'Normal', 'type': 'radio', 'parentId': 'setPlayType', 'id': '0p' });
            chrome.contextMenus.create({ 'title': 'Repeat', 'type': 'radio', 'parentId': 'setPlayType', 'id': '1p' });
            chrome.contextMenus.create({ 'title': 'Shuffle', 'type': 'radio', 'parentId': 'setPlayType', 'id': '2p' });
        chrome.contextMenus.create({ 'title': 'Next Media', 'parentId': 'playlist', 'id': 'next' });
        chrome.contextMenus.create({ 'title': 'Previous Media', 'parentId': 'playlist', 'id': 'previous' });
    
    chrome.contextMenus.create({ 'title': 'Help', 'id': 'openHelpWindow' });
})