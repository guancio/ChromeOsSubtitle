(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildautosrt: function(player, controls, layers, media) {
	    var 
	    t = this;

	    var entries = [];
	    var dirs = [];


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

