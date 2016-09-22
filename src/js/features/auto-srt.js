(function() {
    MediaElementPlayer.prototype.autosrt = function() {
        if(!packaged_app)
            return;
        
        var t = this,
            autoLoadDirectory;
        
        t.media.addEventListener('loadeddata', function() {
            if(!autoLoadDirectory || !t.playlist[t.playIndex].fileEntry) {
                return;
            }
            
            chrome.fileSystem.getDisplayPath(t.playlist[t.playIndex].fileEntry, function(path) {
                var temp = path.slice(autoLoadDirectory.path.length + 1).split('.').slice(0, -1).join('.') + '.srt';
                
                autoLoadDirectory.entry.getFile(temp, {}, function(fileEntry) {
                    fileEntry.file(function(file) {
                        t.filterFiles([file]);
                    });
                }, function() {});
            });
        });
        
        $('<li/>')
            .append($('<label style="width:210px;float:left;">Enable auto-srt</label>'))
            .append($('<button id="allowedAutoSrtButton" style="width:140px">Select Folder</button>'))
            .appendTo($('#settings_list'));
        
        $('#allowedAutoSrtButton').on('click', function(e) {
            e.stopPropagation();
            
            chrome.fileSystem.chooseEntry({
                type: 'openDirectory'
            }, function(entry) {
                if(chrome.runtime.lastError) {
                    return;
                }
                
                chrome.fileSystem.getDisplayPath(entry, function(path) {
                    $('#allowedAutoSrtButton').text('...' + path.slice(-15));
                    autoLoadDirectory = {
                        path: path,
                        entry: entry
                    };
                    
                    mejs.Utility.storage.set('autoSrtRetainId', chrome.fileSystem.retainEntry(entry));
                });
            });
        });
        
        mejs.Utility.storage.get('autoSrtRetainId', null, function(retainId) {
            if(retainId === null) {
                return;
            }
            
            chrome.fileSystem.restoreEntry(retainId, function(entry) {
                if(chrome.runtime.lastError) {
                    return;
                }
                
                chrome.fileSystem.getDisplayPath(entry, function(path) {
                    $('#allowedAutoSrtButton').text('...' + path.slice(-15));
                    
                    autoLoadDirectory = {
                        path: path,
                        entry: entry
                    };
                });
            });
        });
    };
})();
