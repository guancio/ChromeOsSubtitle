(function() {
    MediaElementPlayer.prototype.drop = function() {
        var t = this;
        
        $(document)
            .on('dragover dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
            }, false)
            .on('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                t.filterFiles(e.dataTransfer.files, false);
            }, false);
    }
})();
