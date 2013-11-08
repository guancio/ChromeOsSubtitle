var myURL = window.URL || window.webkitURL;

var packaged_app = (window.location.origin.indexOf("chrome-extension") == 0);



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
		    mainMediaElement.stop();
		    t.openedFile = draggedVideo;

		    var path = window.URL.createObjectURL(draggedVideo);
		    mainMediaElement.setSrc(path);
		}
		player.tracks = [];
		if (draggedSrt != null) {
		    player.openSrtEntry(draggedSrt);
		}
	    }, false);
	}
    });
})(mejs.$);


(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildinfo: function(player, controls, layers, media) {
	    var 
	    t = this;
	    var infoText = 
		'<div class="me-window" style="color:#fff;margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;width:650px;display: table; height: auto;background: url(background.png);background: rgba(50,50,50,0.7);border: solid 1px transparent;padding: 10px;overflow: hidden;-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0;font-size: 16px;visibility: hidden;"><img src="icon.png" style="width:80px;height: auto;"/>'+
		    '<h2>Subtitle Videoplayer v1.6.0</h2>' +
		'A small Chrome video player that supports external subtitles. Plase visit our project <a href="https://github.com/guancio/ChromeOsSubtitle">home page</a>.<br><br>';
	    infoText = infoText + 'You can donate to this project via <a href="https://flattr.com/submit/auto?user_id=guancio&url=https://github.com/guancio/ChromeOsSubtitle&title=ChromeOsSubtitle&language=&tags=github&category=software"><img src="flattr.png"></a><br><br>';

	    if (!packaged_app) {
		infoText = infoText +
		    'Plase install the <a href="https://chrome.google.com/webstore/detail/subtitle-videoplayer/naikohapihpbhficdpbddmgbhiccijca?hl=en-GB" target="_blank">packaged app</a> version of this application, that also integrate with opensubtitles.org<br><br>'; 
	    }

	    infoText = infoText +
		'This software is possible thanks to several open source projects:<ul>'+
		'<li>The main madia player component is a fork of <a id="link_mediaelement" href="http://mediaelementjs.com/">MediaelEment.js</a>, developed by John Dyer</li>'+
		'<li>Zip files are opened using <a href="http://gildas-lormeau.github.io/zip.js/" target="_blank">zip.js</a></li>';
	    if (packaged_app) { 
		infoText = infoText + '<li>Subtitles service powered by <a href="http://www.OpenSubtitles.org" target="_blank">www.OpenSubtitles.org</a>. More uploaded subs means more subs available. Please opload <a href="http://www.opensubtitles.org/upload" target="_blank">here</a> jour subs.<br/><a href="http://www.OpenSubtitles.org" target="_blank"><img src="opensubtitle.gif"/></a></li>';
	    }
	    infoText = infoText + '</ul>[Click the box to close the info window]</div>'

	    var info = $(infoText
	    ).appendTo(controls[0].parentElement);

	    info.find("a").click(function (e) {
		window.open(this.href,'_blank');
		event.stopPropagation();
		return false;
	    });

	    function hideInfo(e) {
		info.css('visibility','hidden');
		if (player.media.paused)
		    $(".mejs-overlay-play").show();
		
		e.preventDefault();
		e.stopPropagation();
		player.container.off("click", hideInfo);
		return false;
	    }

	    t.openInfoWindow = function() {
		$('.me-window').css('visibility','hidden');
		info.css('visibility','visible');
		$(".mejs-overlay-play").hide();
		player.container.click(hideInfo);
	    };

	    var open  = 
		$('<div class="mejs-button mejs-info-button mejs-info" >' +
		  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('About...') + '" aria-label="' + mejs.i18n.t('About...') + '"></button>' +
		  '</div>')
		.appendTo(controls)
		.click(function(e) {
		    e.preventDefault();
		    t.openInfoWindow();
		    return false;
		});
	}
    });
})(mejs.$);


var myURL = window.URL || window.webkitURL;

var mainMediaElement = null;

// $('#main').append('<video width="1024" height="590" id="player" controls="controls"></video>');
$('#main').append('<video id="player" controls="controls"></video>');

var features = ['source', 'settings','playpause','progress','current','duration', 'tracks','subdelay', 'subsize', 'volume', 'settingsbutton', 'info', 'help', 'fullscreen', 'drop'];
    if (packaged_app)
	features.push('opensubtitle');

$('#player').mediaelementplayer({
    startLanguage:'en',
    isVideo:true,
    hideCaptionsButtonWhenEmpty:false,
    mode:"native",
    features: features,
    keyActions: [
	{
	    keys: [
		32, // SPACE
		179 // GOOGLE play/pause button
	    ],
	    action: function(player, media) {
		if (media.readyState != 4)
		    return;
		
		if (media.paused || media.ended) {
		    media.play();	
		} else {
		    media.pause();
		}										
	    }
	},
	{
	    keys: [38], // UP
	    action: function(player, media) {
		var newVolume = Math.min(media.volume + 0.1, 1);
		media.setVolume(newVolume);
	    }
	},
	{
	    keys: [40], // DOWN
	    action: function(player, media) {
		var newVolume = Math.max(media.volume - 0.1, 0);
		media.setVolume(newVolume);
	    }
	},
	{
	    keys: [
		37, // LEFT
		227 // Google TV rewind
	    ],
	    action: function(player, media) {
		if (!isNaN(media.duration) && media.duration > 0) {
		    if (player.isVideo) {
			player.showControls();
			player.startControlsTimer();
		    }
		    
		    // 5%
		    var newTime = Math.max(media.currentTime - player.options.defaultSeekBackwardInterval(media), 0);
		    media.setCurrentTime(newTime);
		}
	    }
	},
	{
	    keys: [
		39, // RIGHT
		228 // Google TV forward
	    ], 
	    action: function(player, media) {
		if (!isNaN(media.duration) && media.duration > 0) {
		    if (player.isVideo) {
			player.showControls();
			player.startControlsTimer();
		    }
		    
		    // 5%
		    var newTime = Math.min(media.currentTime + player.options.defaultSeekForwardInterval(media), media.duration);										
		    media.setCurrentTime(newTime);
		}
	    }
	},
	{
	    keys: [70], // f
	    action: function(player, media) {
		if (typeof player.enterFullScreen != 'undefined') {
		    if (player.isFullScreen) {
			player.exitFullScreen();
		    } else {
			player.enterFullScreen();
		    }
		}
	    }
	},
	{
	    keys: [79], // O
	    action: function(player, media) {
		player.openFileForm();
	    }
	},
	{
	    keys: [68],  // D
	    action: function(player, media) {
		if (!player.openedFile)
		    return;
		player.openSubtitleLogIn();
	    }
	},
	{
	    keys: [73],  // I
	    action: function(player, media) {
		player.openInfoWindow();
	    }
	},
	{
	    keys: [83],  // S
	    action: function(player, media) {
		player.openSettingsWindow();
	    }
	},
	{
	    keys: [72],  // H
	    action: function(player, media) {
		player.openHelpWindow();
	    }
	},
	{
	    keys: [109],  // -
	    action: function(player, media) {
		player.decCaptionSize();
	    }
	},
	{
	    keys: [107],  // +
	    action: function(player, media) {
		player.incCaptionSize();
	    }
	},
	{
	    keys: [90],  // z
	    action: function(player, media) {
		player.decCaptionDelay();
	    }
	},
	{
	    keys: [88],  // x
	    action: function(player, media) {
		player.incCaptionDelay();
	    }
	},
    ],
    success: function (mediaElement, domObject) { 
	mainMediaElement = mediaElement;

	mainMediaElement.player.container
	    .addClass('mejs-container-fullscreen');
	mainMediaElement.player.container
	    .width('100%')
	    .height('100%');

	var t = mainMediaElement.player;
	if (mainMediaElement.player.pluginType === 'native') {
	    t.$media
		.width('100%')
		.height('100%');
	} else {
	    t.container.find('.mejs-shim')
		.width('100%')
		.height('100%');
	    
	    //if (!mejs.MediaFeatures.hasTrueNativeFullScreen) {
	    t.media.setVideoSize($(window).width(),$(window).height());
	    //}
	}

	t.layers.children('div')
	    .width('100%')
	    .height('100%');

	t.setControlsSize();


	function openCmdLineVideo() {
	    if (!window.launchData)
		return false;
	    if (!window.launchData.items)
		return false;
	    if (window.launchData.items.length != 1)
		return false;
	    entry = window.launchData.items[0].entry;
	    if (entry == null)
		return false;

	    mainMediaElement.stop();
	    entry.file(function fff(file) {
		mainMediaElement.openedFile = file;

		var path = window.URL.createObjectURL(file);
		mainMediaElement.setSrc(path);
		mainMediaElement.play();
	    });
	    return true;
	}

	if (!openCmdLineVideo())
	    mediaElement.player.openInfoWindow();

    }
});
