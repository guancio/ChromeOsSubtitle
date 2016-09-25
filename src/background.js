chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create('index.html', { id: 'master', outerBounds: { width: 1040, height: 600, minWidth: 500, minHeight: 300 }, hidden: true }, function(win) {
    win.contentWindow.launchData = launchData;
  });
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.notifications.onClicked.addListener(function() {
        chrome.app.window.create('wiki.html', { id: 'wiki', outerBounds: { width: 1040, height: 600 } });
        chrome.notifications.clear('updateNotify');
    });
    
    chrome.notifications.create('updateNotify', {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Here is what\'s new in Subtitle Video Player!',
        message: 'Google Materials Design Face-lift.\nFixes for many annoying bugs!\nLeaner, Meaner and Fitter!',
        contextMessage: 'Click on this notification to visit the Wiki!',
        priority: 2,
        isClickable: true,
        requireInteraction: true
    }, function(id) {
        setTimeout(function() {
            chrome.notifications.clear(id);
        }, 60000);
    });
});

chrome.runtime.onInstalled.addListener(function() {
    var aspects = ['Default', '1:1', '4:3', '16:9', '16:10', '2.21:1', '2.35:1', '2.39:1', '5:4'],
        encodings = ['UTF-8', 'ibm866 Cyrillic', 'iso-8859-2 Latin-2', 'iso-8859-3 Latin-3', 'iso-8859-4 Latin-4', 'iso-8859-5 Cyrillic', 'iso-8859-6 Arabic', 'iso-8859-7 Greek', 'iso-8859-8 Hebrew', 'iso-8859-10 Latin-6', 'iso-8859-13 ', 'iso-8859-14', 'iso-8859-15', 'iso-8859-16', 'koi8-r', 'koi8-u', 'windows-874', 'windows-1250', 'windows-1251', 'windows-1252 US-ascii', 'windows-1253', 'windows-1254 Latin-5', 'windows-1255', 'windows-1256 Arabic', 'windows-1257', 'windows-1258', 'gbk Chinese', 'gb18030', 'euc-jp', 'iso-2022-jp', 'shift_jis', 'euc-kr'
        ];
    
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
        for(var i = 0; i < aspects.length; i++) {
            chrome.contextMenus.create({ 'title': aspects[i], 'type': 'radio', 'parentId': 'setAspectRatio', 'id': i + 'a' });
        }
    
    chrome.contextMenus.create({ 'title': 'Subtitles', 'id': 'subtitles' });
        chrome.contextMenus.create({ 'title': 'Download Subtitles', 'parentId': 'subtitles', 'id': 'openSubtitleLogIn' });
        chrome.contextMenus.create({ 'title': 'Encoding', 'parentId': 'subtitles', 'id': 'setEncoding' });
            for(var i = 0; i < encodings.length; i++) {
                chrome.contextMenus.create({ 'title': encodings[i], 'type': 'radio', 'parentId': 'setEncoding', 'id': i + 'e' });
            }
        chrome.contextMenus.create({ 'title': 'Display Size', 'parentId': 'subtitles', 'id': 'captionSize' });
            chrome.contextMenus.create({ 'title': 'Increase', 'parentId': 'captionSize', 'id': 'incCaptionSize' });
            chrome.contextMenus.create({ 'title': 'Decrease', 'parentId': 'captionSize', 'id': 'decCaptionSize' });
    
    chrome.contextMenus.create({ 'title': 'Playlist', 'id': 'playlist' });
        chrome.contextMenus.create({ 'title': 'Navigation', 'parentId': 'playlist', 'id': 'setPlayType' });
            chrome.contextMenus.create({ 'title': 'Normal', 'type': 'radio', 'parentId': 'setPlayType', 'id': '0n' });
            chrome.contextMenus.create({ 'title': 'Repeat', 'type': 'radio', 'parentId': 'setPlayType', 'id': '1n' });
            chrome.contextMenus.create({ 'title': 'Shuffle', 'type': 'radio', 'parentId': 'setPlayType', 'id': '2n' });
        chrome.contextMenus.create({ 'title': 'Next Media', 'parentId': 'playlist', 'id': 'next' });
        chrome.contextMenus.create({ 'title': 'Previous Media', 'parentId': 'playlist', 'id': 'previous' });
    
    chrome.contextMenus.create({ 'title': 'Help', 'id': 'openHelp' });
});
