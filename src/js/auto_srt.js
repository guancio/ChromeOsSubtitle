(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildautosrt: function(player, controls, layers, media) {
	    var 
	    t = this;

	    var entries = [];
	    var dirs = [];

	    media.addEventListener('loadeddata',function() {
		if (player.openedFileEntry == null)
		    return;
		// TODO avoid to search the srt if ona has been alreade specified by the user
		
		chrome.fileSystem.getDisplayPath(player.openedFileEntry, function (path) {
		    var dirEntry = null;
		    var subPath = "";
		    for (var i=0; i<dirs.length; i++) {
			var dir = dirs[i];
			if (path.indexOf(dir.path) != 0)
			    continue;

			dirEntry = dir.entry;
			subPath = path.substr(dir.path.length);
		    }
		    if (dirEntry == null)
			return;

		    subPath = subPath.substr(1, subPath.lastIndexOf(".")-1);
		    dirEntry.getFile(subPath+".srt", {},function(fileEntry) {
			fileEntry.file(function (file) {
			    player.openSrtEntry(file);
			});
		    });
		});
	    });

	    var settingsList = $('#settings_list')[0];
	    $('<li/>')
    		.appendTo(settingsList)
    		.append($('<label style="width:250px; float:left;">Enable auto-srt</label>'))
	        .append($('<button id="allowedAutoSrtButton" style="width:100px">Select Folder</button>'));

	    $('#allowedAutoSrtButton').click(function() {
		chrome.fileSystem.chooseEntry({
		    type: "openDirectory"
		}, function (entry) {
		    chrome.fileSystem.getDisplayPath(entry, function (path) {
			$('#allowedAutoSrtButton').text(path);
			var retainId = chrome.fileSystem.retainEntry(entry);
			
			dirs = [];
			entries = [];

			dirs.push({
			    path: path,
			    entry: entry,
			});
			entries.push(retainId);

	    		setIntoSettings(
	    		    'autoSrtEntries',
	    		    entries,
	    		    function () {}
	    		);
		    });
		});
	    });

	    getFromSettings(
	    	'autoSrtEntries',
	    	[],
	    	function (value) {
		    entries = value;
		    for (var i=0; i<entries.length; i++) {
			var retainId = entries[i];
			chrome.fileSystem.restoreEntry(retainId, function (entry) {
			    chrome.fileSystem.getDisplayPath(entry, function (path) {
				$('#allowedAutoSrtButton').text(path);

				dirs = [];

				dirs.push({
				    path: path,
				    entry: entry,
				});
			    });
			});
		    }
	    	}
	    );
	}
    })
})(mejs.$);

