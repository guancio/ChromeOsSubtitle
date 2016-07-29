(function($) {
    MediaElementPlayer.prototype.builddrop = function() {
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
            
            var draggedMedia = null,
                draggedSrt = null;
            
            if(e.dataTransfer.types.indexOf('Files') >= 0) {
                var files = e.dataTransfer.files;
                for(var i = 0; i < files.length; i++) {
                    var file = files[i];
                    
                    if(file.type.startsWith("video") || file.type.startsWith("audio"))
                        draggedMedia = file;
                    else if(file.type.indexOf("subrip") >= 0)
                        draggedSrt = file;
                    else if(file.type.indexOf("application/zip") >= 0)
                        draggedSrt = file;
                }
            }
            
            if(draggedMedia !== null) {
                t.stop();
                t.openedFile = draggedMedia;
                t.openedFileEntry = null;
                
                t.setSrc(window.URL.createObjectURL(draggedMedia));
            }
            
            t.tracks = [];
            
            if(draggedSrt !== null) {
                t.openSrtEntry(draggedSrt);
            }
        }, false);
    }
})(mejs.$);