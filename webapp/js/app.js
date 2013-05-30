var chosenVideoFileEntry = null;
var chosenSrtFileEntry = null;
var chooseVideoFileButton = $('#choose_video_file')[0];
var chooseSrtFileButton = $('#choose_srt_file')[0];
var startButton = $('#start_button')[0];
var startButton2 = $('#start_button2')[0];

chooseVideoFileButton.addEventListener('change', function(e) {
    if (chooseVideoFileButton.files.length != 1) {
	console.log('No file selected.');
	return;
    }
    if (!chooseVideoFileButton.files[0]) {
	console.log('No file selected.');
	return;
    }
    console.log(chooseVideoFileButton.files[0]);
    chosenVideoFileEntry = chooseVideoFileButton.files[0];
});

chooseSrtFileButton.addEventListener('change', function(e) {
    if (chooseSrtFileButton.files.length != 1) {
	console.log('No file selected.');
	return;
    }
    if (!chooseSrtFileButton.files[0]) {
	console.log('No file selected.');
	return;
    }
    console.log(chooseSrtFileButton.files[0]);
    chosenSrtFileEntry = chooseSrtFileButton.files[0];
});

startButton.addEventListener('click', function(e) {
    $('#main').empty();
    var myURL = window.URL || window.webkitURL;
    $('#main').append('<video width="360" height="203" id="player" controls="controls"></video>');
    $('#player').append('<source src="'+myURL.createObjectURL(chosenVideoFileEntry)+'" type="video/mp4">');
    $('#player').append('<track kind="subtitles" src="'+myURL.createObjectURL(chosenSrtFileEntry)+'" srclang="en" />');
    $('#player').mediaelementplayer({
	startLanguage:'en',
	success: function (mediaElement, domObject) { 
	    mediaElement.play();
	}
    });
});


