var chosenVideoFileEntry = null;
var chosenSrtFileEntry = null;
var chooseVideoFileButton = $('#choose_video_file')[0];
var chooseSrtFileButton = $('#choose_srt_file')[0];
var startButton = $('#start_button')[0];
var startButton2 = $('#start_button2')[0];

chooseVideoFileButton.addEventListener('click', function(e) {
    chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {
	if (!readOnlyEntry) {
	    console.log('No file selected.');
	    return;
	}
	console.log(readOnlyEntry);
	chosenVideoFileEntry = readOnlyEntry;
	chrome.fileSystem.getDisplayPath(chosenVideoFileEntry, function(path) {
	    $('#video_file_path')[0].value = path;
	});
    });
});

chooseSrtFileButton.addEventListener('click', function(e) {
    chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {
	if (!readOnlyEntry) {
	    console.log('No file selected.');
	    return;
	}
	console.log(readOnlyEntry);
	chosenSrtFileEntry = readOnlyEntry;
	chrome.fileSystem.getDisplayPath(chosenSrtFileEntry, function(path) {
	    $('#srt_file_path')[0].value = path;
	});
    });
});

startButton.addEventListener('click', function(e) {
    $('#main').append('<video width="360" height="203" id="player" controls="controls"></video>');
    // chosenVideoFileEntry.file(function(fff) {
    //     var reader = new FileReader();
    //     reader.onerror = function(e) {
    // 	    console.log(e);
    // 	};
    //     reader.onloadend = function(e) {
    // 	    $('#player').append('<source src="'+this.result+'" type="video/mp4">');
	    
    // 	    chrome.fileSystem.getDisplayPath(chosenSrtFileEntry, function(path) {
    // 		$('#player').append('<track kind="subtitles" src="'+path+'" srclang="en" />');
    // 		$('#player').mediaelementplayer({});
    // 	    });
    //     };
    //     reader.readAsDataURL(fff);
    // });
    chosenVideoFileEntry.file(function fff(file) {
	$('#player').append('<source src="'+window.URL.createObjectURL(file)+'" type="video/mp4">');
	chosenSrtFileEntry.file(function fff(file) {
	    $('#player').append('<track kind="subtitles" src="'+window.URL.createObjectURL(file)+'" srclang="en" />');
	    $('#player').mediaelementplayer({
		startLanguage:'en'
	    });
	});
    });
});


startButton2.addEventListener('click', function(e) {
    $('#main').append('<video width="360" height="203" id="player" controls="controls"></video>');
    $('#player').mediaelementplayer({
	startLanguage:'en'
    });
});

