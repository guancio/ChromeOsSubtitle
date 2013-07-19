var chosenVideoFileEntry = null;
var chosenSrtFileEntry = null;
var chooseVideoFileButton = $('#choose_video_file')[0];
var chooseSrtFileButton = $('#choose_srt_file')[0];
var startButton = $('#start_button')[0];
var startButton2 = $('#start_button2')[0];

var defaultSize = 

MediaElementPlayer.prototype.buildsubsize = function(player, controls, layers, media) {
    var
    // create the button
    dec =
        $('<div class="mejs-subsize">' +
	    '<span>-</span>' +
	  '</div>')
    // append it to the toolbar
        .appendTo(controls)
	.click(function() {
	    $('.mejs-captions-layer').css({
		"line-height":function( index, value ) {
		    return ( parseFloat( value )/ 1.2) + "px";
		},
		"font-size":function( index, value ) {
		    return ( parseFloat( value )/1.2) + "px";
		}
	    });
	});  

    var
    // create the button
    inc =
        $('<div class="mejs-subsize">' +
	    '<span>+</span>' +
	  '</div>')
    // append it to the toolbar
        .appendTo(controls)
	.click(function() {
	    $('.mejs-captions-layer').css({
		"line-height":function( index, value ) {
		    return ( parseFloat( value )* 1.2) + "px";
		},
		"font-size":function( index, value ) {
		    return ( parseFloat( value )*1.2) + "px";
		}
	    });
	});  
};

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
    $('#main').append('<video width="1024" height="500" id="player" controls="controls"></video>');
    $('#player').append('<source src="'+myURL.createObjectURL(chosenVideoFileEntry)+'" type="video/mp4">');
    $('#player').append('<track kind="subtitles" src="'+myURL.createObjectURL(chosenSrtFileEntry)+'" srclang="en" />');
    $('#player').mediaelementplayer({
	startLanguage:'en',
	features: ['playpause','progress','current','duration','subsize', 'tracks','volume','fullscreen'],
	success: function (mediaElement, domObject) { 
	    mediaElement.play();
	}
    });
});


