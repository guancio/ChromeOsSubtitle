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
            
            var draggedMedia = [],
                draggedSrt = [];
            
            if(e.dataTransfer.types.indexOf('Files') >= 0) {
                var files = e.dataTransfer.files;
                for(var i = 0; i < files.length; i++) {
                    var file = files[i];
                    
                    if(file.type.startsWith("video") || file.type.startsWith("audio"))
                        draggedMedia.push(file);
                    else if(file.type.indexOf("subrip") >= 0 || file.type.indexOf("application/zip") >= 0)
                        draggedSrt.push(file);
                }
            }
            
            if(draggedMedia !== []) {
                t.stop();
                t.playlist = draggedMedia;
                
                t.playIndex = 0;
                
                t.setSrc(t.playlist[t.playIndex]);
            }
            
            t.tracks = [];
            
            if(draggedSrt !== []) {
                t.openSrtEntry(draggedSrt[0]);
            }
        }, false);
    }
})(mejs.$);
