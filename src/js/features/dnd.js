(function() {
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
            
            if(t.getDuration() && !t.isPaused()) {
                t.pause();
            }
            
            t.playlist = [];
            t.filterFiles(e.dataTransfer.files);
            
            if(t.playlist.length > 0) {
                t.tracks = [];
                t.playIndex = 0;
                t.setSrc(t.playlist[t.playIndex]);
            }
        }, false);
    }
})();
