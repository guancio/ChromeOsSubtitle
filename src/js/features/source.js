(function() {
    MediaElementPlayer.prototype.source = function() {
        var t = this;
        
        $('<div class="mejs-button mejs-source-button mejs-source">' +
            '<button type="button" title="' + chrome.i18n.getMessage('media') + '"></button>' +
        '</div>')
            .appendTo(t.leftControls)
            .on('click', function(e) {
                e.preventDefault();
                t.openFileForm();
            });
        
        t.openFileForm = function() {
            if(t.getDuration() && !t.isPaused()) {
                t.pause();
            }
            
            chrome.fileSystem.chooseEntry({
                type: 'openFile',
                acceptsMultiple: true,
                acceptsAllTypes: false,
                accepts: [
                            {
                                extensions: t.mediaExts
                            }
                ]
            }, function(entries) {
                var temp = [];
                
                if(chrome.runtime.lastError) {
                    return;
                }
                
                wrnch.forEachSync(entries, function(entry, i, next) {
                    entry.file(function(file) {
                        file.fileEntry = entry;
                        temp.push(file);
                        next();
                    });
                }, function() {
                    t.filterFiles(temp, true);
                });
            });
        };
    };
})();
