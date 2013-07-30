var chosenVideoFileEntry = null;
var chosenSrtFileEntry = null;
var chooseVideoFileButton = $('#choose_video_file')[0];
var chooseSrtFileButton = $('#choose_srt_file')[0];
var startButton = $('#start_button')[0];
var startButton2 = $('#start_button2')[0];
var myURL = window.URL || window.webkitURL;

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


(function($) {
    $.extend(mejs.MepDefaults, {
	sourceText: mejs.i18n.t('Open video...')
    });

    $.extend(MediaElementPlayer.prototype, {
	buildsource: function(player, controls, layers, media) {
	    var 
	    t = this,
	    open  = 
		$('<div class="mejs-button mejs-playpause-button mejs-play" >' +
		  '<button type="button" aria-controls="' + t.id + '" title="' + t.options.sourceText + '" aria-label="' + t.options.sourceText + '"></button>' +
		  '</div>')
		.appendTo(controls)
		.click(function(e) {
		    e.preventDefault();
		    
		    chrome.fileSystem.chooseEntry({type: 'openFile'}, function(theFileEntry) {
			mainMediaElement.stop();
			theFileEntry.file(function fff(file) {
			    var path = window.URL.createObjectURL(file);
			// var a = myURL.createObjectURL(theFileEntry);
			    // chrome.fileSystem.getDisplayPath(theFileEntry, function(path) {
			    mainMediaElement.setSrc(path);
			});
		    });
		    return false;
		});
	}
    });
})(mejs.$);


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
    mainMediaElement.stop();
    var a = myURL.createObjectURL(chosenVideoFileEntry);
    mainMediaElement.setSrc(a);
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


var myURL = window.URL || window.webkitURL;

var mainMediaElement = null;

$('#main').append('<video width="1024" height="500" id="player" controls="controls"></video>');
$('#player').mediaelementplayer({
    startLanguage:'en',
    isVideo:true,
    mode:"native",
    features: ['source', 'playpause','progress','current','duration','subsize', 'tracks','volume','fullscreen'],
    success: function (mediaElement, domObject) { 
	mainMediaElement = mediaElement;
	// mediaElement.play();
    }
});
