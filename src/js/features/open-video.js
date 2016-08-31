(function() {
    MediaElementPlayer.prototype.source = function() {
        var t = this,
            open = mejs.Utility.createNestedElement('<div class="mejs-button mejs-source-button mejs-source" >' +
                '<button type="button" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
                '</div>');
        
        t.leftControls[0].appendChild(open);
        
        t.openFileForm = function() {
            var temp = [];
            
            if(t.getDuration() && !t.isPaused()) {
                t.pause();
            }
            
            if(packaged_app) {
                chrome.fileSystem.chooseEntry({
                    type: "openFile",
                    acceptsMultiple: true,
                    acceptsAllTypes: false,
                    accepts: [
                                {
                                    extensions: ['aac', 'mp4', 'm4a', 'mp1', 'mp2', 'mp3', 'mpg', 'mpeg', 'oga', 'ogg', 'wav', 'webm', 'm4v', 'ogv', 'mkv']
                                }
                    ]
                }, function(entries) {
                    if(typeof entries === 'undefined') {
                        return;
                    }
                    
                    entries.forEach(function(entry, i) {
                        entry.file(function(file) {
                            temp.push(file);
                            
                            if(i === entries.length - 1) {
                                t.filterFiles(temp, true);
                            }
                        });
                    });
                });
            }
        };
        
        open.addEventListener('click', function(e) {
            e.preventDefault();
            t.openFileForm();
            return false;
        });
    }
})();
