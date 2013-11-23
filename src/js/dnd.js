(function($) {
    $.extend(MediaElementPlayer.prototype, {
	builddrop: function(player, controls, layers, media) {
	    var 
	    t = this;
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
		var draggedVideo = null;
		var draggedSrt = null;
		if (e.dataTransfer.types.indexOf('Files') >= 0) {
		    var files = e.dataTransfer.files;
		    for (var i = 0; i < files.length; i++) {
			var file = files[i];
			if (file.type.indexOf("video") >= 0)
			    draggedVideo = file;
			else if (file.type.indexOf("subrip") >= 0)
			    draggedSrt = file;
			else if (file.type.indexOf("application/zip") >= 0)
			    draggedSrt = file;
		    }
		}
		if (draggedVideo != null) {
		    media.stop();
		    t.openedFile = draggedVideo;

		    var path = window.URL.createObjectURL(draggedVideo);
		    media.setSrc(path);
		}
		player.tracks = [];
		if (draggedSrt != null) {
		    player.openSrtEntry(draggedSrt);
		}
	    }, false);
	}
    });
})(mejs.$);
