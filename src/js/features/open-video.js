(function($) {
    MediaElementPlayer.prototype.buildsource = function() {
        var t = this,
            openFileInput = mejs.Utility.createNestedElement('<input style="display:none" type="file" id="openfile_input" multiple/>'),
            open = mejs.Utility.createNestedElement('<div class="mejs-button mejs-source-button mejs-source" >' +
                '<button type="button" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
                '</div>');
        
        t.controls[0].appendChild(openFileInput);
        t.controls[0].appendChild(open);
        
        t.openFileForm = function() {
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
                    t.playIndex = 0;
                    
                    entries.forEach(function(entry, i) {
                        entry.file(function(file) {
                            t.playlist.push(file);
                            
                            if(i === entries.length - 1) {
                                t.stop();
                                t.tracks = [];
                                
                                t.setSrc(t.playlist[t.playIndex]);
                            }
                        });
                    });
                });
            } else {
                openFileInput.click();
            }
        };
        
        open.addEventListener('click', function(e) {
            e.preventDefault();
            t.openFileForm();
            return false;
        });
        
        openFileInput.addEventListener('change', function(e) {
            if(openFileInput.length === 0) {
                return;
            }
            
            t.stop();
            t.tracks = [];
            
            t.playlist = openFileInput.files;
            t.playIndex = 0;
            t.setSrc(t.playlist[t.playIndex]);
        });
    }
})(mejs.$);
