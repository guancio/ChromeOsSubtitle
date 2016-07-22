(function($) {
    MediaElementPlayer.prototype.buildsource = function(player, controls, layers, media) {
        var t = this,
            openFileInput = $('<input style="display:none" type="file" id="openfile_input"/>')
            .appendTo(controls);
        t.openedFile = null;
        var open = $('<div class="mejs-button mejs-source-button mejs-source" >' +
                '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
                '</div>')
            .appendTo(controls);
        player.openFileForm = function() {
            if(media.duration && !media.paused)
                player.pause();
            
            if(packaged_app) {
                chrome.fileSystem.chooseEntry({
                    type: "openFile"
                }, function(entry) {
                    entry.file(function fff(file) {
                        player.stop();
                        player.tracks = [];
                        
                        t.openedFile = file;
                        t.openedFileEntry = entry;
                        player.setSrc(window.URL.createObjectURL(file));
                    });
                });
            } else {
                openFileInput[0].click();
            }
        };
        open.click(function(e) {
            e.preventDefault();
            player.openFileForm();
            return false;
        });
        openFileInput.change(function(e) {
            player.stop();
            player.tracks = [];
            var path = window.URL.createObjectURL(openFileInput[0].files[0]);
            t.openedFile = openFileInput[0].files[0];
            player.setSrc(path);
        });
    }
})(mejs.$);