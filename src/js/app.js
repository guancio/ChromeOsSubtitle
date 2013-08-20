var myURL = window.URL || window.webkitURL;

MediaElementPlayer.prototype.buildsubsize = function(player, controls, layers, media) {
    var captionSelector = player.captionsButton.find('.mejs-captions-selector');
    var
    t = this;
    // create the buttons
    var dec =
        $('<div class="mejs-button mejs-reduce-button mejs-reduce" >' +
	  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Decrease caption size') + '" aria-label="' + mejs.i18n.t('Decrease caption size') + '"></button>' +  '</div>')
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
    var inc = 
	$('<div class="mejs-button mejs-increase-button mejs-increase" >' +
	  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Increase caption size') + '" aria-label="' + mejs.i18n.t('Increase caption size') + '"></button>' +  '</div>')
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

    var line =
	$('<li class="mejs-captionsize"></li>')
	.append(dec)
	.append($('<label>Caption size</label>'))
	.append(inc);
    captionSelector.find('ul').prepend(line);
};


MediaElementPlayer.prototype.buildsubdelay = function(player, controls, layers, media) {
    var captionSelector = player.captionsButton.find('.mejs-captions-selector');
    var
    t = this;
    var value =
	$('<input style="background-color: transparent; width: 52px; color: white; font-size: 10px;clear: none"></input>').
	on('input',function(e){
	    t.capDelayValue = Number(t.capDelayInput.value);
	}
	);

    t.capDelayInput = value[0];
    t.capDelayInput.value = 0;

    // create the buttons
    var dec =
        $('<div class="mejs-button mejs-reduce-button mejs-reduce" >' +
	  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Decrease caption delay') + '" aria-label="' + mejs.i18n.t('Decrease caption delay') + '"></button>' +  '</div>')
	.click(function() {
	    t.capDelayInput.value = (Number(t.capDelayInput.value) - 0.1).toFixed(1);
	    t.capDelayValue = Number(t.capDelayInput.value);
	}); 
    var inc = 
	$('<div class="mejs-button mejs-increase-button mejs-increase" >' +
	  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Increase caption delay') + '" aria-label="' + mejs.i18n.t('Increase caption delay') + '"></button>' +  '</div>')
	.click(function() {
	    t.capDelayInput.value = (Number(t.capDelayInput.value) + 0.1).toFixed(1);
	    t.capDelayValue = Number(t.capDelayInput.value);
	});

    var line =
	$('<li class="mejs-captionsize"></li>')
	.append(dec)
	.append(value)
	.append(inc);
    captionSelector.find('ul').prepend(line);

    media.addEventListener('loadeddata',function() {
	t.capDelayInput.value = 0;
	t.capDelayValue = 0;
    });

};


(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildsource: function(player, controls, layers, media) {
	    var 
	    t = this,
	    open  = 
		$('<div class="mejs-button mejs-source-button mejs-source" >' +
		  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
		  '</div>')
		.appendTo(controls)
		.click(function(e) {
		    e.preventDefault();
		    
		    chrome.fileSystem.chooseEntry({type: 'openFile'}, function(theFileEntry) {
			if (theFileEntry == null)
			    return;
			mainMediaElement.stop();
			theFileEntry.file(function fff(file) {
			    var path = window.URL.createObjectURL(file);
			    mainMediaElement.setSrc(path);
			});
		    });
		    return false;
		});
	}
    });
})(mejs.$);



var myURL = window.URL || window.webkitURL;

var mainMediaElement = null;

// $('#main').append('<video width="1024" height="590" id="player" controls="controls"></video>');
$('#main').append('<video id="player" controls="controls"></video>');
$('#player').mediaelementplayer({
    startLanguage:'en',
    isVideo:true,
    hideCaptionsButtonWhenEmpty:false,
    mode:"native",
    features: ['source', 'playpause','progress','current','duration', 'tracks','subdelay', 'subsize', 'volume', 'fullscreen'],
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

	if (!window.launchData)
	    return;
	if (!window.launchData.items)
	    return;
	if (window.launchData.items.length != 1)
	    return;
	entry = window.launchData.items[0].entry;
	if (entry == null)
	    return;
	mainMediaElement.stop();
	entry.file(function fff(file) {
	    var path = window.URL.createObjectURL(file);
	    mainMediaElement.setSrc(path);
	    mainMediaElement.play();
	});
    }
});
