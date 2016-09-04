(function() {
    MediaElementPlayer.prototype.source = function() {
        var t = this;
        
        $('<div class="mejs-button mejs-source-button mejs-source">' +
            '<button type="button" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
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
            
            if(packaged_app) {
                chrome.fileSystem.chooseEntry({
                    type: 'openFile',
                    acceptsMultiple: true,
                    acceptsAllTypes: false,
                    accepts: [
                                {
                                    extensions: t.options.mediaExts
                                }
                    ]
                }, function(entries) {
                    var temp = [];
                    
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
    }
})();
