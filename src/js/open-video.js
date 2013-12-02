var packaged_app = (window.location.origin.indexOf("chrome-extension") == 0);

(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildsource: function(player, controls, layers, media) {
	    var 
	    t = this,
	    openFileInput = $('<input style="display:none" type="file" id="openfile_input"/>')
		.appendTo(controls);
	    t.openedFile = null;
	    var open  = 
		$('<div class="mejs-button mejs-source-button mejs-source" >' +
		  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
		  '</div>')
		.appendTo(controls);
	    player.openFileForm = function () {
		if (packaged_app) {
		    chrome.fileSystem.chooseEntry({
			type: "openFile"
		    }, function (entry) {
			entry.file(function fff(file) {
			    media.stop();
			    player.tracks = [];			    
			    var path = window.URL.createObjectURL(file);
			    t.openedFile = file;
			    t.openedFileEntry = entry;
			    mainMediaElement.setSrc(path);
			    mainMediaElement.play();
			});
		    });
		}
		else {
		    openFileInput[0].click();
		}
	    };
	    open.click(function(e) {
		e.preventDefault();
		player.openFileForm();
		return false;
	    });
	    openFileInput.change(function (e) {
		media.stop();
		player.tracks = [];
		var path = window.URL.createObjectURL(openFileInput[0].files[0]);
		t.openedFile = openFileInput[0].files[0];
		media.setSrc(path);
		return false;
	    });
	}
    });
})(mejs.$);
