(function($) {
    MediaElementPlayer.prototype.builddrop = function(player, controls, layers, media) {
        var t = this;
        
        document.body.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, false);
        document.body.addEventListener('dragleave', function(e) {
            e.preventDefault();
        }, false);
        document.body.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var draggedVideo = null,
                draggedSrt = null;
            
            if(e.dataTransfer.types.indexOf('Files') >= 0) {
                var files = e.dataTransfer.files;
                for(var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if(file.type.indexOf("video") >= 0)
                        draggedVideo = file;
                    else if(file.type.indexOf("subrip") >= 0)
                        draggedSrt = file;
                    else if(file.type.indexOf("application/zip") >= 0)
                        draggedSrt = file;
                }
            }
            
            if(draggedVideo != null) {
                mainMediaElement.stop();
                t.openedFile = draggedVideo;
                t.openedFileEntry = null;
                
                mainMediaElement.setSrc(window.URL.createObjectURL(draggedVideo));
            }
            
            player.tracks = [];
            
            if(draggedSrt != null) {
                player.openSrtEntry(draggedSrt);
            }
        }, false);
    }
})(mejs.$);