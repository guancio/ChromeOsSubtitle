(function() {
    MediaElementPlayer.prototype.autosrt = function() {
        var t = this,
            autoLoadDirectory;
        
        t.media.addEventListener('loadeddata', function() {
            if(!autoLoadDirectory || !t.playlist[t.playIndex].fileEntry) {
                return;
            }
            
            chrome.fileSystem.getDisplayPath(t.playlist[t.playIndex].fileEntry, function(path) {
                var temp = [],
                    path = path.slice(autoLoadDirectory.path.length + 1).split('.').slice(0, -1).join('.');
                
                wrnch.forEachSync(t.subExts, function(extension, i, next) {
                    autoLoadDirectory.entry.getFile(path + '.' + extension, {}, function(fileEntry) {
                        fileEntry.file(function(file) {
                            temp.push(file);
                            next();
                            
                            if(i === t.subExts.length - 1) {
                                t.filterFiles(temp);
                            }
                        });
                    }, function() {
                        next();
                        
                        if(i === t.subExts.length - 1) {
                            t.filterFiles(temp);
                        }
                    });
                });
            });
        });
        
        $('<li/>')
            .append($('<label>Enable auto-srt</label>'))
            .append($('<button id="allowedAutoSrtButton" style="width: 90px">Select Folder</button>'))
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
                    $('#allowedAutoSrtButton').text('...' + path.slice(-10));
                    autoLoadDirectory = {
                        path: path,
                        entry: entry
                    };
                    
                    wrnch.storage.set('autoSrtRetainId', chrome.fileSystem.retainEntry(entry));
                });
            });
        });
        
        wrnch.storage.get('autoSrtRetainId', null, function(retainId) {
            if(retainId === null) {
                return;
            }
            
            chrome.fileSystem.restoreEntry(retainId, function(entry) {
                if(chrome.runtime.lastError) {
                    return;
                }
                
                chrome.fileSystem.getDisplayPath(entry, function(path) {
                    $('#allowedAutoSrtButton').text('...' + path.slice(-10));
                    
                    autoLoadDirectory = {
                        path: path,
                        entry: entry
                    };
                });
            });
        });
    };
})();
