(function($) {
    MediaElementPlayer.prototype.buildsource = function() {
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
                    acceptsMultiple: true
                }, function(entries) {
                    if(typeof entries === 'undefined') {
                        return;
                    }
                    
                    t.playlist = [];
                    
                    entries.forEach(function(entry, i) {
                        entry.file(function(file) {
                            temp.push(file);
                            
                            if(i === entries.length - 1) {
                                t.filterFiles(temp);
                                
                                if(t.playlist.length > 0) {
                                    t.tracks = [];
                                    t.playIndex = 0;
                                    t.setSrc();
                                }
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
})(mejs.$);
